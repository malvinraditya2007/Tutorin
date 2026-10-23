import crypto from "crypto";
import { db, withTransaction } from "../lib/db.js";
import { computeFees, minutesToDurationEnum } from "../lib/fees.js";

/** Service booking: pembuatan, penerimaan, penolakan. */

export class BookingError extends Error {}

/** Referensi booking singkat, mis. "TTR-4821". */
function makeReference() {
  return `TTR-${Math.floor(1000 + Math.random() * 8999)}`;
}

function formatDate(d) {
  return d instanceof Date ? d.toISOString().slice(0, 19).replace("T", " ") : d;
}

/**
 * Buat booking berstatus `menunggu_pembayaran` dan tautkan ke slot.
 */
export async function createBooking(studentId, input) {
  return withTransaction(async (conn) => {
    // 1. Validasi slot
    const [slotRows] = await conn.query(
      "SELECT id, mentor_id, starts_at, ends_at, state FROM availability_slots WHERE id = ? FOR UPDATE",
      [input.slotId]
    );
    const slot = slotRows[0];
    if (!slot) throw new BookingError("Slot tidak ditemukan.");
    if (slot.mentor_id !== input.mentorId) {
      throw new BookingError("Slot bukan milik mentor ini.");
    }
    if (slot.state !== "open") {
      throw new BookingError("Slot sudah dipesan. Pilih waktu lain.");
    }

    // 2. Validasi mentor
    const [mentorRows] = await conn.query(
      "SELECT hourly_rate, is_published FROM mentor_profiles WHERE user_id = ?",
      [input.mentorId]
    );
    const mentor = mentorRows[0];
    if (!mentor || !mentor.is_published) {
      throw new BookingError("Mentor tidak tersedia.");
    }

    const fees = computeFees(mentor.hourly_rate, input.durationMinutes);
    const durationEnum = minutesToDurationEnum(input.durationMinutes).replace(/^m/, "");

    const bookingId = crypto.randomUUID();
    const paymentId = crypto.randomUUID();
    const reference = makeReference();

    await conn.query(
      `INSERT INTO bookings 
        (id, reference, student_id, mentor_id, subject_id, slot_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu_pembayaran', ?)`,
      [
        bookingId,
        reference,
        studentId,
        input.mentorId,
        input.subjectId,
        input.slotId,
        input.topic || null,
        formatDate(slot.starts_at),
        formatDate(slot.ends_at),
        durationEnum,
        input.mode,
        mentor.hourly_rate,
      ]
    );

    await conn.query(
      `INSERT INTO payments 
        (id, booking_id, amount, service_fee, total, status)
       VALUES (?, ?, ?, ?, ?, 'diproses')`,
      [paymentId, bookingId, fees.amount, fees.serviceFee, fees.total]
    );

    await conn.query(
      "UPDATE availability_slots SET state = 'booked' WHERE id = ?",
      [input.slotId]
    );

    return {
      id: bookingId,
      reference,
      studentId,
      mentorId: input.mentorId,
      subjectId: input.subjectId,
      slotId: input.slotId,
      topic: input.topic,
      scheduledStartAt: slot.starts_at,
      scheduledEndAt: slot.ends_at,
      durationMinutes: durationEnum,
      mode: input.mode,
      status: "menunggu_pembayaran",
      hourlyRateSnapshot: mentor.hourly_rate,
    };
  });
}
