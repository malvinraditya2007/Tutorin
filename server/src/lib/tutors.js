import { db } from "./db.js";

/** Avatar default untuk mentor yang belum mengunggah foto. */
const DEFAULT_AVATAR = "/avatar-default.svg";

/**
 * Ambil daftar tutor terpublikasi dari database.
 * filter: { search?, subjects?: string[], prices?: string[], ratings?: string[], sort? }
 */
export async function getTutors(limit = 50, filter) {
  const whereClauses = ["mp.is_published = 1"];
  const params = [];

  if (filter?.search && filter.search.trim() !== "") {
    const q = `%${filter.search.trim()}%`;
    whereClauses.push(
      `(u.full_name LIKE ? OR u.campus LIKE ? OR mp.study_program LIKE ? OR mp.headline LIKE ? OR EXISTS (
        SELECT 1 FROM mentor_subjects ms 
        JOIN subjects s ON ms.subject_id = s.id 
        WHERE ms.mentor_id = mp.user_id AND s.name LIKE ?
      ))`
    );
    params.push(q, q, q, q, q);
  }

  if (filter?.subjects && filter.subjects.length > 0) {
    const placeholders = filter.subjects.map(() => "?").join(",");
    whereClauses.push(
      `EXISTS (
        SELECT 1 FROM mentor_subjects ms 
        JOIN subjects s ON ms.subject_id = s.id 
        WHERE ms.mentor_id = mp.user_id AND s.name IN (${placeholders})
      )`
    );
    params.push(...filter.subjects);
  }

  if (filter?.prices && filter.prices.length > 0) {
    const priceClauses = filter.prices.map((p) => {
      const [min, max] = p.split("-").map(Number);
      return "(mp.hourly_rate >= ? AND mp.hourly_rate <= ?)";
    });
    whereClauses.push(`(${priceClauses.join(" OR ")})`);
    for (const p of filter.prices) {
      const [min, max] = p.split("-").map(Number);
      params.push(min, max);
    }
  }

  if (filter?.ratings && filter.ratings.length > 0) {
    const minRating = Math.min(...filter.ratings.map(Number));
    if (minRating > 0) {
      whereClauses.push("mp.rating_avg >= ?");
      params.push(minRating);
    }
  }

  let orderClause = "ORDER BY mp.rating_avg DESC, mp.rating_count DESC";
  if (filter?.sort === "price_asc") {
    orderClause = "ORDER BY mp.hourly_rate ASC, mp.rating_avg DESC";
  } else if (filter?.sort === "sessions") {
    orderClause = "ORDER BY mp.sessions_completed DESC, mp.rating_avg DESC";
  }

  const sql = `
    SELECT 
      mp.user_id,
      mp.university,
      mp.study_program,
      mp.headline,
      mp.bio,
      mp.hourly_rate,
      mp.rating_avg,
      mp.rating_count,
      mp.sessions_completed,
      u.full_name,
      u.campus,
      u.avatar_url
    FROM mentor_profiles mp
    JOIN users u ON mp.user_id = u.id
    WHERE ${whereClauses.join(" AND ")}
    ${orderClause}
    LIMIT ?
  `;
  params.push(Number(limit) || 50);

  const [mentors] = await db.query(sql, params);
  if (mentors.length === 0) return [];

  // Ambil subjects untuk setiap mentor
  const mentorIds = mentors.map((m) => m.user_id);
  const placeholders = mentorIds.map(() => "?").join(",");
  const [subjectRows] = await db.query(
    `SELECT ms.mentor_id, s.name 
     FROM mentor_subjects ms
     JOIN subjects s ON ms.subject_id = s.id
     WHERE ms.mentor_id IN (${placeholders})`,
    mentorIds
  );

  const subjectsByMentor = new Map();
  for (const row of subjectRows) {
    if (!subjectsByMentor.has(row.mentor_id)) {
      subjectsByMentor.set(row.mentor_id, []);
    }
    subjectsByMentor.get(row.mentor_id).push(row.name);
  }

  return mentors.map((m) => {
    const subjectNames = subjectsByMentor.get(m.user_id) || [];
    return {
      id: m.user_id,
      name: m.full_name,
      program: `${m.study_program} • ${m.campus ?? ""}`.replace(/ • $/, ""),
      subject: subjectNames[0] ?? "Umum",
      subjects: subjectNames,
      headline: m.headline ?? undefined,
      sessionsCompleted: m.sessions_completed,
      photoUrl: m.avatar_url ?? DEFAULT_AVATAR,
      rating: Number(m.rating_avg),
      reviewCount: m.rating_count,
      pricePerHour: m.hourly_rate,
      nextSlot: undefined,
    };
  });
}

/**
 * Ambil detail satu tutor berdasarkan id (user id mentor). Mengembalikan null
 * jika tidak ditemukan / belum terpublikasi.
 */
export async function getTutorById(id) {
  const [mentors] = await db.query(
    `SELECT 
      mp.user_id,
      mp.university,
      mp.study_program,
      mp.semester,
      mp.headline,
      mp.bio,
      mp.hourly_rate,
      mp.rating_avg,
      mp.rating_count,
      mp.sessions_completed,
      mp.is_verified,
      u.full_name,
      u.campus,
      u.avatar_url
    FROM mentor_profiles mp
    JOIN users u ON mp.user_id = u.id
    WHERE mp.user_id = ? AND mp.is_published = 1`,
    [id]
  );
  const m = mentors[0];
  if (!m) return null;

  // Subjects
  const [subjectRows] = await db.query(
    `SELECT s.id, s.name 
     FROM mentor_subjects ms
     JOIN subjects s ON ms.subject_id = s.id
     WHERE ms.mentor_id = ?`,
    [id]
  );

  // Reviews lewat booking
  const [reviewRows] = await db.query(
    `SELECT 
      r.id,
      r.rating,
      r.comment,
      r.is_anonymous,
      r.created_at,
      u.full_name AS student_name,
      s.name AS subject_name
    FROM reviews r
    JOIN bookings b ON r.booking_id = b.id
    JOIN users u ON b.student_id = u.id
    JOIN subjects s ON b.subject_id = s.id
    WHERE b.mentor_id = ?
    ORDER BY r.created_at DESC
    LIMIT 6`,
    [id]
  );

  // Slots mendatang
  const [slots] = await db.query(
    `SELECT id, starts_at, ends_at 
     FROM availability_slots
     WHERE mentor_id = ? AND state = 'open' AND starts_at >= NOW()
     ORDER BY starts_at ASC
     LIMIT 12`,
    [id]
  );

  return {
    id: m.user_id,
    name: m.full_name,
    university: m.university,
    studyProgram: m.study_program,
    semester: m.semester,
    campus: m.campus,
    headline: m.headline,
    bio: m.bio,
    photoUrl: m.avatar_url ?? DEFAULT_AVATAR,
    pricePerHour: m.hourly_rate,
    rating: Number(m.rating_avg),
    reviewCount: m.rating_count,
    sessionsCompleted: m.sessions_completed,
    isVerified: Boolean(m.is_verified),
    subjects: subjectRows.map((s) => ({ id: s.id, name: s.name })),
    defaultSubjectId: subjectRows[0]?.id ?? null,
    reviews: reviewRows.map((r) => ({
      id: r.id,
      name: r.is_anonymous ? "Anonim" : r.student_name.split(" ").slice(0, 2).join(" "),
      subject: r.subject_name,
      rating: r.rating,
      text: r.comment ?? "",
    })),
    slots: slots.map((s) => ({ id: s.id, startsAt: s.starts_at, endsAt: s.ends_at })),
  };
}
