import crypto from "crypto";
import { db } from "../lib/db.js";

/** Service notifikasi in-app. */

/** Daftar notifikasi milik user, terbaru dulu. */
export async function listNotifications(userId) {
  const [rows] = await db.query(
    `SELECT 
      id, 
      user_id AS userId, 
      category, 
      title, 
      body, 
      booking_id AS bookingId, 
      is_read AS isRead, 
      created_at AS createdAt 
     FROM notifications
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT 50`,
    [userId]
  );

  return rows.map((r) => ({
    ...r,
    isRead: Boolean(r.isRead),
  }));
}

/** Tandai semua notifikasi user sebagai dibaca. */
export async function markAllRead(userId) {
  await db.query(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0",
    [userId]
  );
}

/**
 * Buat notifikasi. Menerima `client` opsional (bisa connection transaksi).
 * input: { userId, category, title, body?, bookingId? }
 */
export async function createNotification(input, client = db) {
  const id = crypto.randomUUID();
  await client.query(
    `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 0, NOW())`,
    [id, input.userId, input.category, input.title, input.body || null, input.bookingId || null]
  );
  return { id, ...input, isRead: false };
}
