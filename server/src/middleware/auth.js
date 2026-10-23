import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";

export const COOKIE_NAME = "tutorin_token";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 hari

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET belum diatur di .env");
  return s;
}

/** Buat JWT sesi lalu pasang sebagai cookie httpOnly. */
export function setSessionCookie(res, userId) {
  const token = jwt.sign({ uid: userId }, secret(), { expiresIn: "30d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

/** Bentuk user publik yang aman dikirim ke klien (tanpa passwordHash). */
export function publicUser(u) {
  return {
    id: u.id,
    role: u.role,
    fullName: u.fullName ?? u.full_name,
    email: u.email,
    campus: u.campus,
    avatarUrl: u.avatarUrl ?? u.avatar_url,
  };
}

/** Middleware: isi req.user bila cookie valid (tidak menolak bila tidak ada). */
export async function loadUser(req, _res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token) {
      const payload = jwt.verify(token, secret());
      const [rows] = await db.query(
        "SELECT id, role, full_name, email, password_hash, campus, avatar_url, deleted_at FROM users WHERE id = ?",
        [payload.uid]
      );
      const user = rows[0];
      if (user && !user.deleted_at) {
        req.user = {
          id: user.id,
          role: user.role,
          fullName: user.full_name,
          email: user.email,
          campus: user.campus,
          avatarUrl: user.avatar_url,
          passwordHash: user.password_hash,
        };
      }
    }
  } catch {
    // token tidak valid / kedaluwarsa → anggap belum login
  }
  next();
}

/** Wajib login (peran apa pun). */
export function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Belum login." });
  next();
}

/** Wajib memiliki peran tertentu ('mahasiswa' atau 'mentor'). */
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Belum login." });
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Akses ditolak untuk peran ini." });
    }
    next();
  };
}

/** Pembungkus async handler agar error masuk ke middleware penanganan error. */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
