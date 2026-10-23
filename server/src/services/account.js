import crypto from "crypto";
import { db, withTransaction } from "../lib/db.js";
import { hashPassword, verifyPassword } from "../lib/password.js";

/** Service akun email/password. */

export class AccountError extends Error {}

/**
 * Daftar akun baru dengan email/password. Atomik:
 *   1. Cek email belum terpakai
 *   2. Hash password
 *   3. Buat User dengan peran; untuk mentor sekaligus MentorProfile + wallet
 */
export async function registerUser(input) {
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [input.email]);
  if (existing.length > 0) {
    throw new AccountError("Email ini sudah terdaftar. Coba masuk.");
  }

  const passwordHash = await hashPassword(input.password);
  const userId = crypto.randomUUID();

  return withTransaction(async (conn) => {
    await conn.query(
      `INSERT INTO users (id, role, full_name, email, password_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, input.role, input.fullName, input.email, passwordHash]
    );

    if (input.role === "mentor") {
      await conn.query(
        `INSERT INTO mentor_profiles (user_id, university, study_program, hourly_rate, discord_url)
         VALUES (?, '', '', 50000, '')`,
        [userId]
      );
      await conn.query(
        `INSERT INTO wallets (user_id, available_balance, escrow_balance, total_earnings)
         VALUES (?, 0, 0, 0)`,
        [userId]
      );
    }

    return {
      id: userId,
      email: input.email,
      fullName: input.fullName,
      role: input.role,
    };
  });
}

/**
 * Verifikasi kredensial login. Mengembalikan user bila cocok, null bila tidak.
 * User lama yang hanya punya akun Google (tanpa passwordHash) tidak bisa login
 * sampai mereka mengatur password lewat alur reset.
 */
export async function verifyCredentials(email, password) {
  const [rows] = await db.query(
    `SELECT id, role, full_name, email, password_hash, campus, avatar_url, deleted_at 
     FROM users WHERE email = ?`,
    [email]
  );
  const user = rows[0];
  if (!user || !user.password_hash || user.deleted_at) return null;

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return null;

  return {
    id: user.id,
    role: user.role,
    fullName: user.full_name,
    email: user.email,
    campus: user.campus,
    avatarUrl: user.avatar_url,
    passwordHash: user.password_hash,
  };
}
