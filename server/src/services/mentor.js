import { db, withTransaction } from "../lib/db.js";

/** Service profil mentor: baca + perbarui data profil. */

export class MentorError extends Error {}

/** Ambil profil mentor lengkap (untuk form edit + ringkasan). */
export async function getMentorProfile(userId) {
  const [profileRows] = await db.query(
    `SELECT 
      mp.*,
      u.full_name,
      u.email,
      u.campus,
      u.avatar_url
    FROM mentor_profiles mp
    JOIN users u ON mp.user_id = u.id
    WHERE mp.user_id = ?`,
    [userId]
  );

  const p = profileRows[0];
  if (!p) return null;

  const [subjectRows] = await db.query(
    `SELECT s.id, s.name, s.slug, s.icon 
     FROM mentor_subjects ms
     JOIN subjects s ON ms.subject_id = s.id
     WHERE ms.mentor_id = ?`,
    [userId]
  );

  return {
    userId: p.user_id,
    university: p.university,
    studyProgram: p.study_program,
    semester: p.semester,
    headline: p.headline,
    bio: p.bio,
    hourlyRate: p.hourly_rate,
    discordUrl: p.discord_url,
    isVerified: Boolean(p.is_verified),
    isPublished: Boolean(p.is_published),
    ratingAvg: p.rating_avg,
    ratingCount: p.rating_count,
    sessionsCompleted: p.sessions_completed,
    user: {
      id: p.user_id,
      fullName: p.full_name,
      email: p.email,
      campus: p.campus,
      avatarUrl: p.avatar_url,
    },
    subjects: subjectRows.map((s) => ({
      subjectId: s.id,
      subject: s,
    })),
  };
}

/** Daftar semua mata kuliah (untuk pilihan di form profil mentor). */
export async function listSubjects() {
  const [rows] = await db.query("SELECT * FROM subjects ORDER BY name ASC");
  return rows;
}

/**
 * Perbarui profil mentor + nama & foto user. Atomik.
 * Validasi dasar: tarif positif, nama & program tidak kosong.
 */
export async function updateMentorProfile(userId, input) {
  if (!input.fullName.trim()) throw new MentorError("Nama tidak boleh kosong.");
  if (!input.studyProgram.trim()) throw new MentorError("Program studi tidak boleh kosong.");
  if (!Number.isFinite(input.hourlyRate) || input.hourlyRate <= 0) {
    throw new MentorError("Tarif per jam harus lebih dari 0.");
  }

  await withTransaction(async (conn) => {
    if (input.avatarUrl !== undefined) {
      await conn.query("UPDATE users SET full_name = ?, avatar_url = ? WHERE id = ?", [
        input.fullName.trim(),
        input.avatarUrl,
        userId,
      ]);
    } else {
      await conn.query("UPDATE users SET full_name = ? WHERE id = ?", [input.fullName.trim(), userId]);
    }

    await conn.query(
      `UPDATE mentor_profiles 
       SET university = ?, study_program = ?, bio = ?, headline = ?, hourly_rate = ?, discord_url = ?, is_published = ?
       WHERE user_id = ?`,
      [
        input.university.trim(),
        input.studyProgram.trim(),
        input.bio.trim() || null,
        input.headline.trim() || null,
        Math.round(input.hourlyRate),
        input.discordUrl.trim(),
        input.isPublished ? 1 : 0,
        userId,
      ]
    );

    if (input.subjectIds) {
      await conn.query("DELETE FROM mentor_subjects WHERE mentor_id = ?", [userId]);
      for (const subjectId of input.subjectIds) {
        await conn.query("INSERT INTO mentor_subjects (mentor_id, subject_id) VALUES (?, ?)", [
          userId,
          subjectId,
        ]);
      }
    }
  });
}
