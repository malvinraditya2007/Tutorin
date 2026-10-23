import { db } from "./db.js";
import { DURATION_MINUTES } from "./fees.js";

/** Avatar default bila mentor belum mengunggah foto. */
const FALLBACK_PHOTO = "/avatar-default.svg";

/**
 * Ambil detail booking lengkap untuk halaman checkout / konfirmasi.
 * Mengembalikan null bila tidak ada atau bukan milik student.
 */
export async function getBookingDetail(bookingId, studentId) {
  const [rows] = await db.query(
    `SELECT 
      b.id,
      b.reference,
      b.status,
      b.mentor_id,
      b.student_id,
      b.topic,
      b.scheduled_start_at,
      b.scheduled_end_at,
      b.duration_minutes,
      b.mode,
      b.hourly_rate_snapshot,
      p.amount AS payment_amount,
      p.service_fee AS payment_service_fee,
      p.total AS payment_total,
      s.name AS subject_name,
      u.full_name AS mentor_name,
      u.avatar_url AS mentor_avatar
    FROM bookings b
    LEFT JOIN payments p ON p.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN mentor_profiles mp ON b.mentor_id = mp.user_id
    JOIN users u ON mp.user_id = u.id
    WHERE b.id = ?`,
    [bookingId]
  );

  const b = rows[0];
  if (!b || b.student_id !== studentId) return null;

  return {
    id: b.id,
    reference: b.reference,
    status: b.status,
    mentorId: b.mentor_id,
    studentId: b.student_id,
    mentorName: b.mentor_name,
    mentorPhoto: b.mentor_avatar ?? FALLBACK_PHOTO,
    subjectName: b.subject_name,
    topic: b.topic,
    startsAt: b.scheduled_start_at,
    endsAt: b.scheduled_end_at,
    durationMinutes: DURATION_MINUTES[b.duration_minutes] ?? DURATION_MINUTES[`m${b.duration_minutes}`] ?? 60,
    mode: b.mode,
    amount: b.payment_amount ?? b.hourly_rate_snapshot,
    serviceFee: b.payment_service_fee ?? 0,
    total: b.payment_total ?? b.hourly_rate_snapshot,
  };
}

const PAYMENT_STATUS_LABEL = {
  escrow: { label: "Escrow", tone: "peach" },
  selesai: { label: "Selesai", tone: "teal" },
  diproses: { label: "Diproses", tone: "neutral" },
  refund: { label: "Refund", tone: "neutral" },
};

/** Daftar transaksi (pembayaran) milik mahasiswa, terbaru dulu. */
export async function getStudentTransactions(studentId) {
  const [rows] = await db.query(
    `SELECT 
      b.id,
      b.created_at,
      b.duration_minutes,
      b.hourly_rate_snapshot,
      p.total AS payment_total,
      p.status AS payment_status,
      s.name AS subject_name,
      u.full_name AS mentor_name
    FROM bookings b
    JOIN payments p ON p.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN mentor_profiles mp ON b.mentor_id = mp.user_id
    JOIN users u ON mp.user_id = u.id
    WHERE b.student_id = ?
    ORDER BY b.created_at DESC`,
    [studentId]
  );

  return rows.map((b) => {
    const status = b.payment_status ?? "diproses";
    const meta = PAYMENT_STATUS_LABEL[status] ?? { label: status, tone: "neutral" };
    return {
      id: b.id,
      date: b.created_at,
      mentorName: b.mentor_name,
      subjectName: b.subject_name,
      durationMinutes: DURATION_MINUTES[b.duration_minutes] ?? DURATION_MINUTES[`m${b.duration_minutes}`] ?? 60,
      total: b.payment_total ?? b.hourly_rate_snapshot,
      statusLabel: meta.label,
      tone: meta.tone,
    };
  });
}

/** Ringkasan transaksi mahasiswa untuk kartu atas. */
export async function getStudentTransactionSummary(studentId) {
  const [payments] = await db.query(
    `SELECT p.total, p.status 
     FROM payments p
     JOIN bookings b ON p.booking_id = b.id
     WHERE b.student_id = ?`,
    [studentId]
  );

  let totalPaid = 0;
  let escrowActive = 0;
  let processing = 0;
  for (const p of payments) {
    if (p.status === "selesai") totalPaid += p.total;
    if (p.status === "escrow") escrowActive += p.total;
    if (p.status === "diproses") processing += p.total;
  }
  const completedCount = payments.filter((p) => p.status === "selesai").length;
  const escrowCount = payments.filter((p) => p.status === "escrow").length;

  return { totalPaid, escrowActive, processing, completedCount, escrowCount };
}

/** Booking masuk untuk mentor, dipisah per status. */
export async function getMentorRequests(mentorId) {
  const [rows] = await db.query(
    `SELECT 
      b.id,
      b.reference,
      b.topic,
      b.scheduled_start_at,
      b.scheduled_end_at,
      b.duration_minutes,
      b.mode,
      b.status,
      b.hourly_rate_snapshot,
      p.amount AS payment_amount,
      p.total AS payment_total,
      s.name AS subject_name,
      u.full_name AS student_name
    FROM bookings b
    LEFT JOIN payments p ON p.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN users u ON b.student_id = u.id
    WHERE b.mentor_id = ?
    ORDER BY b.scheduled_start_at ASC`,
    [mentorId]
  );

  const map = (b) => ({
    id: b.id,
    reference: b.reference,
    studentName: b.student_name,
    subjectName: b.subject_name,
    topic: b.topic,
    startsAt: b.scheduled_start_at,
    endsAt: b.scheduled_end_at,
    durationMinutes: DURATION_MINUTES[b.duration_minutes] ?? DURATION_MINUTES[`m${b.duration_minutes}`] ?? 60,
    mode: b.mode,
    total: b.payment_amount ?? b.hourly_rate_snapshot,
    status: b.status,
  });

  return {
    incoming: rows.filter((b) => b.status === "dibayar").map(map),
    accepted: rows.filter((b) => b.status === "diterima").map(map),
    history: rows
      .filter((b) => ["selesai", "ditolak", "refund", "dibatalkan", "kedaluwarsa"].includes(b.status))
      .map(map),
  };
}

/** Sesi milik mahasiswa dipisah mendatang vs selesai. */
export async function getStudentSessions(studentId) {
  const [rows] = await db.query(
    `SELECT 
      b.id,
      b.mentor_id,
      b.topic,
      b.scheduled_start_at,
      b.scheduled_end_at,
      b.mode,
      b.status,
      s.name AS subject_name,
      u.full_name AS mentor_name,
      u.avatar_url AS mentor_avatar,
      mp.discord_url
    FROM bookings b
    JOIN subjects s ON b.subject_id = s.id
    JOIN mentor_profiles mp ON b.mentor_id = mp.user_id
    JOIN users u ON mp.user_id = u.id
    WHERE b.student_id = ? AND b.status IN ('dibayar', 'diterima', 'selesai')
    ORDER BY b.scheduled_start_at ASC`,
    [studentId]
  );

  const map = (b) => ({
    id: b.id,
    mentorId: b.mentor_id,
    mentorName: b.mentor_name,
    mentorPhoto: b.mentor_avatar ?? FALLBACK_PHOTO,
    subjectName: b.subject_name,
    topic: b.topic,
    startsAt: b.scheduled_start_at,
    endsAt: b.scheduled_end_at,
    mode: b.mode,
    status: b.status,
    discordUrl: b.discord_url ?? null,
  });

  return {
    upcoming: rows.filter((b) => b.status !== "selesai").map(map),
    done: rows.filter((b) => b.status === "selesai").map(map),
  };
}
