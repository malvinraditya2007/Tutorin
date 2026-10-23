import crypto from "crypto";
import { db, withTransaction } from "../lib/db.js";

/**
 * Service pembayaran simulasi.
 */

export class PaymentError extends Error {}

/**
 * Bayar booking. Atomik:
 *   1. Validasi booking milik student + status `menunggu_pembayaran`
 *   2. Payment → `escrow`, catat method + paidAt
 *   3. Booking → `dibayar`
 *   4. Dana masuk escrow mentor (wallet.escrow_balance += amount)
 *   5. Notifikasi: mahasiswa "pembayaran berhasil", mentor "booking baru"
 */
export async function payBooking(studentId, bookingId, method) {
  const [rows] = await db.query(
    `SELECT 
      b.id,
      b.mentor_id,
      b.student_id,
      b.status,
      p.id AS payment_id,
      p.amount AS payment_amount,
      p.total AS payment_total,
      s.name AS subject_name,
      um.full_name AS mentor_name,
      us.full_name AS student_name
    FROM bookings b
    LEFT JOIN payments p ON p.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN users um ON b.mentor_id = um.id
    JOIN users us ON b.student_id = us.id
    WHERE b.id = ?`,
    [bookingId]
  );

  const booking = rows[0];
  if (!booking || booking.student_id !== studentId) {
    throw new PaymentError("Booking tidak ditemukan.");
  }
  if (booking.status !== "menunggu_pembayaran") {
    throw new PaymentError("Booking ini sudah diproses.");
  }
  if (!booking.payment_id) {
    throw new PaymentError("Data pembayaran tidak ditemukan.");
  }

  return withTransaction(async (conn) => {
    const extRef = `PAY-${Math.floor(100000 + Math.random() * 899999)}`;

    await conn.query(
      `UPDATE payments 
       SET status = 'escrow', method = ?, provider = 'simulasi', external_ref = ?, paid_at = NOW()
       WHERE id = ?`,
      [method, extRef, booking.payment_id]
    );

    await conn.query(
      "UPDATE bookings SET status = 'dibayar' WHERE id = ?",
      [bookingId]
    );

    await conn.query(
      "UPDATE wallets SET escrow_balance = escrow_balance + ? WHERE user_id = ?",
      [booking.payment_amount, booking.mentor_id]
    );

    const studentNotifId = crypto.randomUUID();
    const mentorNotifId = crypto.randomUUID();

    await conn.query(
      `INSERT INTO notifications (id, user_id, category, title, body, booking_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        studentNotifId,
        studentId,
        "pembayaran",
        "Pembayaran berhasil",
        `Rp${Number(booking.payment_total).toLocaleString("id-ID")} ditahan di escrow untuk kelas ${booking.subject_name} bersama ${booking.mentor_name}.`,
        bookingId,
      ]
    );

    await conn.query(
      `INSERT INTO notifications (id, user_id, category, title, body, booking_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        mentorNotifId,
        booking.mentor_id,
        "sesi",
        "Booking baru masuk",
        `${booking.student_name} membooking kelas ${booking.subject_name} dan sudah membayar.`,
        bookingId,
      ]
    );

    return booking.id;
  });
}
