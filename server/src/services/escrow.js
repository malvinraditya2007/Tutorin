import crypto from "crypto";
import { db, withTransaction } from "../lib/db.js";

function formatDate(d) {
  return d instanceof Date ? d.toISOString().slice(0, 19).replace("T", " ") : d;
}

/**
 * Pelepasan escrow otomatis (lazy settle).
 */
export async function settleDueSessions(now = new Date()) {
  const [dueBookings] = await db.query(
    `SELECT 
      b.id,
      b.reference,
      b.mentor_id,
      b.student_id,
      b.hourly_rate_snapshot,
      p.id AS payment_id,
      p.amount AS payment_amount,
      s.name AS subject_name,
      um.full_name AS mentor_name
    FROM bookings b
    LEFT JOIN payments p ON p.booking_id = b.id
    JOIN subjects s ON b.subject_id = s.id
    JOIN users um ON b.mentor_id = um.id
    WHERE b.status IN ('dibayar', 'diterima') AND b.scheduled_end_at < ?`,
    [formatDate(now)]
  );

  let settled = 0;

  for (const booking of dueBookings) {
    const amount = booking.payment_amount ?? booking.hourly_rate_snapshot;

    await withTransaction(async (conn) => {
      const [freshRows] = await conn.query(
        "SELECT status FROM bookings WHERE id = ? FOR UPDATE",
        [booking.id]
      );
      const fresh = freshRows[0];
      if (!fresh || (fresh.status !== "dibayar" && fresh.status !== "diterima")) {
        return;
      }

      await conn.query("UPDATE bookings SET status = 'selesai' WHERE id = ?", [booking.id]);

      if (booking.payment_id) {
        await conn.query("UPDATE payments SET status = 'selesai' WHERE id = ?", [booking.payment_id]);
      }

      await conn.query(
        `UPDATE wallets 
         SET escrow_balance = escrow_balance - ?, 
             available_balance = available_balance + ?, 
             total_earnings = total_earnings + ? 
         WHERE user_id = ?`,
        [amount, amount, amount, booking.mentor_id]
      );

      const entryId = crypto.randomUUID();
      await conn.query(
        `INSERT INTO wallet_entries (id, wallet_id, type, amount, description, booking_id, created_at)
         VALUES (?, ?, 'in', ?, ?, ?, NOW())`,
        [entryId, booking.mentor_id, amount, `Pembayaran sesi ${booking.reference}`, booking.id]
      );

      await conn.query(
        "UPDATE mentor_profiles SET sessions_completed = sessions_completed + 1 WHERE user_id = ?",
        [booking.mentor_id]
      );

      const studentNotifId = crypto.randomUUID();
      const mentorNotifId = crypto.randomUUID();

      await conn.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, created_at)
         VALUES 
          (?, ?, 'sesi', 'Sesi selesai', ?, ?, NOW()),
          (?, ?, 'pembayaran', 'Dana masuk ke dompet', ?, ?, NOW())`,
        [
          studentNotifId,
          booking.student_id,
          `Kelas ${booking.subject_name} bersama ${booking.mentor_name} sudah selesai. Yuk beri ulasan!`,
          booking.id,
          mentorNotifId,
          booking.mentor_id,
          `Pembayaran kelas ${booking.subject_name} telah diteruskan ke saldo kamu.`,
          booking.id,
        ]
      );

      settled++;
    });
  }

  return settled;
}
