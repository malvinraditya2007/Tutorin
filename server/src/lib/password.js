import bcrypt from "bcryptjs";

/**
 * Hashing & verifikasi password dengan bcrypt (bcryptjs — pure JS, tanpa
 * native build). Cost 10 cukup untuk web app umum.
 */

const SALT_ROUNDS = 10;

export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}
