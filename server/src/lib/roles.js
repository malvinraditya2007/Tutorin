import { db, withTransaction } from "./db.js";

/**
 * Terapkan peran ke user yang belum punya peran (role null). Untuk mentor,
 * sekaligus membuat MentorProfile minimal + wallet agar dashboard berfungsi.
 * Idempoten: tak melakukan apa pun jika user sudah punya peran.
 */
export async function applyRole(userId, role) {
  const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [userId]);
  if (!rows[0] || rows[0].role != null) return;

  await withTransaction(async (conn) => {
    await conn.query("UPDATE users SET role = ? WHERE id = ?", [role, userId]);
    if (role === "mentor") {
      await conn.query(
        `INSERT INTO mentor_profiles (user_id, university, study_program, hourly_rate, discord_url)
         VALUES (?, '', '', 50000, '')
         ON DUPLICATE KEY UPDATE user_id = user_id`,
        [userId]
      );
      await conn.query(
        `INSERT INTO wallets (user_id, available_balance, escrow_balance, total_earnings)
         VALUES (?, 0, 0, 0)
         ON DUPLICATE KEY UPDATE user_id = user_id`,
        [userId]
      );
    }
  });
}
