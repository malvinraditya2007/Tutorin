import crypto from "crypto";
import { db, withTransaction } from "../lib/db.js";
import { DURATION_MINUTES } from "../lib/fees.js";

/**
 * Service ulasan. Mahasiswa memberi ulasan untuk sesi yang sudah `selesai`
 * dan belum pernah diulas.
 */

export class ReviewError extends Error {}

const FALLBACK_PHOTO = "/avatar-default.svg";

/** Booking selesai milik mahasiswa yang BELUM punya review. */
export async function listReviewableBookings(studentId) {
  const [rows] = await db.query(
    `SELECT 
      b.id,
      b.mentor_id AS mentorId,
      b.topic,
      b.scheduled_start_at AS startsAt,
      b.duration_minutes AS durationMinutes,
      b.mode,
      s.name AS subjectName,
      u.full_name AS mentorName,
      u.avatar_url AS mentorAvatar,
      mp.study_program AS mentorProgram,
      mp.university AS mentorUniv
    FROM bookings b
    LEFT JOIN reviews r ON r.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN mentor_profiles mp ON b.mentor_id = mp.user_id
    JOIN users u ON mp.user_id = u.id
    WHERE b.student_id = ? AND b.status = 'selesai' AND r.id IS NULL
    ORDER BY b.scheduled_start_at DESC`,
    [studentId]
  );

  return rows.map((b) => ({
    id: b.id,
    mentorId: b.mentorId,
    mentorName: b.mentorName,
    mentorPhoto: b.mentorAvatar ?? FALLBACK_PHOTO,
    mentorProgram: `${b.mentorProgram} • ${b.mentorUniv}`.replace(/ • $/, ""),
    subjectName: b.subjectName,
    topic: b.topic,
    startsAt: b.startsAt,
    durationMinutes: DURATION_MINUTES[b.durationMinutes] ?? DURATION_MINUTES[`m${b.durationMinutes}`] ?? 60,
    mode: b.mode,
  }));
}

/** Daftar ulasan yang sudah pernah dikirim oleh mahasiswa. */
export async function listSubmittedReviews(studentId) {
  const [reviews] = await db.query(
    `SELECT 
      r.id,
      r.booking_id AS bookingId,
      r.rating,
      r.comment,
      r.is_anonymous AS isAnonymous,
      r.created_at AS createdAt,
      b.mentor_id AS mentorId,
      b.topic,
      b.scheduled_start_at AS startsAt,
      s.name AS subjectName,
      u.full_name AS mentorName,
      u.avatar_url AS mentorAvatar,
      mp.study_program AS mentorProgram,
      mp.university AS mentorUniv
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN mentor_profiles mp ON b.mentor_id = mp.user_id
    JOIN users u ON mp.user_id = u.id
    WHERE b.student_id = ?
    ORDER BY r.created_at DESC`,
    [studentId]
  );

  if (reviews.length === 0) return [];

  const reviewIds = reviews.map((r) => r.id);
  const placeholders = reviewIds.map(() => "?").join(",");
  const [highlightRows] = await db.query(
    `SELECT rh.review_id, ht.label 
     FROM review_highlights rh
     JOIN highlight_tags ht ON rh.highlight_id = ht.id
     WHERE rh.review_id IN (${placeholders})`,
    reviewIds
  );

  const highlightsByReview = new Map();
  for (const h of highlightRows) {
    if (!highlightsByReview.has(h.review_id)) {
      highlightsByReview.set(h.review_id, []);
    }
    highlightsByReview.get(h.review_id).push(h.label);
  }

  return reviews.map((r) => ({
    id: r.id,
    bookingId: r.bookingId,
    mentorId: r.mentorId,
    mentorName: r.mentorName,
    mentorPhoto: r.mentorAvatar ?? FALLBACK_PHOTO,
    mentorProgram: `${r.mentorProgram} • ${r.mentorUniv}`.replace(/ • $/, ""),
    subjectName: r.subjectName,
    topic: r.topic,
    startsAt: r.startsAt,
    rating: r.rating,
    comment: r.comment,
    isAnonymous: Boolean(r.isAnonymous),
    highlights: highlightsByReview.get(r.id) || [],
    createdAt: r.createdAt,
  }));
}

/** Label highlight yang tersedia (dari HighlightTag). */
export async function listHighlightTags() {
  const [rows] = await db.query("SELECT * FROM highlight_tags ORDER BY label ASC");
  return rows;
}

/**
 * Buat ulasan untuk sebuah booking. Atomik:
 *   1. Validasi booking milik student + status selesai + belum diulas
 *   2. Buat Review + ReviewHighlight
 *   3. Perbarui agregat MentorProfile (ratingAvg, ratingCount)
 *   4. Notifikasi ke mentor
 */
export async function createReview(input) {
  if (input.rating < 1 || input.rating > 5) {
    throw new ReviewError("Rating harus antara 1 dan 5.");
  }

  const [bookingRows] = await db.query(
    `SELECT b.id, b.mentor_id, b.student_id, b.status, r.id AS review_id, s.name AS subject_name 
     FROM bookings b
     LEFT JOIN reviews r ON r.booking_id = b.id
     JOIN subjects s ON b.subject_id = s.id
     WHERE b.id = ?`,
    [input.bookingId]
  );

  const booking = bookingRows[0];
  if (!booking || booking.student_id !== input.studentId) {
    throw new ReviewError("Sesi tidak ditemukan.");
  }
  if (booking.status !== "selesai") {
    throw new ReviewError("Hanya sesi yang selesai bisa diulas.");
  }
  if (booking.review_id) {
    throw new ReviewError("Sesi ini sudah pernah kamu ulas.");
  }

  let tagIds = [];
  if (input.highlightLabels && input.highlightLabels.length > 0) {
    const placeholders = input.highlightLabels.map(() => "?").join(",");
    const [tagRows] = await db.query(
      `SELECT id FROM highlight_tags WHERE label IN (${placeholders})`,
      input.highlightLabels
    );
    tagIds = tagRows.map((t) => t.id);
  }

  return withTransaction(async (conn) => {
    const reviewId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO reviews (id, booking_id, rating, comment, is_anonymous, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [reviewId, input.bookingId, input.rating, input.comment?.trim() || null, input.isAnonymous ? 1 : 0]
    );

    for (const tagId of tagIds) {
      await conn.query(
        "INSERT INTO review_highlights (review_id, highlight_id) VALUES (?, ?)",
        [reviewId, tagId]
      );
    }

    // Perbarui agregat rating mentor
    const [profileRows] = await conn.query(
      "SELECT rating_avg, rating_count FROM mentor_profiles WHERE user_id = ? FOR UPDATE",
      [booking.mentor_id]
    );
    const profile = profileRows[0];
    const prevCount = profile?.rating_count ?? 0;
    const prevAvg = Number(profile?.rating_avg ?? 0);
    const newCount = prevCount + 1;
    const newAvg = (prevAvg * prevCount + input.rating) / newCount;

    await conn.query(
      `UPDATE mentor_profiles 
       SET rating_count = ?, rating_avg = ? 
       WHERE user_id = ?`,
      [newCount, Math.round(newAvg * 10) / 10, booking.mentor_id]
    );

    const notifId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO notifications (id, user_id, category, title, body, booking_id, created_at)
       VALUES (?, ?, 'ulasan', 'Ulasan baru dari mahasiswa', ?, ?, NOW())`,
      [
        notifId,
        booking.mentor_id,
        `Kamu mendapat ulasan ${input.rating} bintang untuk kelas ${booking.subject_name}.`,
        booking.id,
      ]
    );
  });
}
