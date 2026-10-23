import crypto from "crypto";
import { db } from "../lib/db.js";

/** Service ketersediaan slot mentor. */

export class SlotError extends Error {}

function formatDate(d) {
  return d instanceof Date ? d.toISOString().slice(0, 19).replace("T", " ") : d;
}

/** Slot mentor dalam rentang waktu tertentu. */
export async function listSlots(mentorId, from, to) {
  const [rows] = await db.query(
    `SELECT id, mentor_id AS mentorId, starts_at AS startsAt, ends_at AS endsAt, state, created_at AS createdAt, updated_at AS updatedAt
     FROM availability_slots
     WHERE mentor_id = ? AND starts_at >= ? AND starts_at < ?
     ORDER BY starts_at ASC`,
    [mentorId, formatDate(from), formatDate(to)]
  );
  return rows;
}

/**
 * Tambah slot baru (durasi default 60 menit). Menolak bila:
 *   - waktu di masa lalu
 *   - bentrok dengan slot lain
 */
export async function addSlot(mentorId, startsAt) {
  const startDate = startsAt instanceof Date ? startsAt : new Date(startsAt);
  if (startDate.getTime() <= Date.now()) {
    throw new SlotError("Slot harus di waktu mendatang.");
  }
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  // Validasi overlap jadwal slot
  const [overlap] = await db.query(
    `SELECT id FROM availability_slots 
     WHERE mentor_id = ? 
       AND state != 'closed'
       AND starts_at < ? AND ends_at > ?`,
    [mentorId, endStr, startStr]
  );

  if (overlap.length > 0) {
    throw new SlotError("Sudah ada slot pada waktu itu.");
  }

  const slotId = crypto.randomUUID();
  await db.query(
    `INSERT INTO availability_slots (id, mentor_id, starts_at, ends_at, state)
     VALUES (?, ?, ?, ?, 'open')`,
    [slotId, mentorId, startStr, endStr]
  );

  return {
    id: slotId,
    mentorId,
    startsAt: startStr,
    endsAt: endStr,
    state: "open",
  };
}

/** Hapus slot. Hanya slot `open` yang boleh dihapus; slot `booked` terkunci. */
export async function removeSlot(mentorId, slotId) {
  const [rows] = await db.query(
    "SELECT id, mentor_id, state FROM availability_slots WHERE id = ?",
    [slotId]
  );
  const slot = rows[0];
  if (!slot || slot.mentor_id !== mentorId) {
    throw new SlotError("Slot tidak ditemukan.");
  }
  if (slot.state === "booked") {
    throw new SlotError("Slot yang sudah dipesan tidak bisa dihapus.");
  }
  await db.query("DELETE FROM availability_slots WHERE id = ?", [slotId]);
}
