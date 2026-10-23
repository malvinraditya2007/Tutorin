import crypto from "crypto";
import { db, withTransaction } from "../lib/db.js";

/** Service dompet & pencairan mentor. */

export class PayoutError extends Error {}

/**
 * Ambil dompet mentor + mutasi terakhir + rekening payout +
 * jumlah sesi yang belum berakhir (dananya masih ditahan escrow).
 */
export async function getWalletOverview(mentorId) {
  const [walletRows] = await db.query(
    "SELECT * FROM wallets WHERE user_id = ?",
    [mentorId]
  );
  const w = walletRows[0] || {
    user_id: mentorId,
    available_balance: 0,
    escrow_balance: 0,
    total_earnings: 0,
  };

  const [entries] = await db.query(
    `SELECT 
      id, 
      wallet_id AS walletId, 
      type, 
      amount, 
      description, 
      booking_id AS bookingId, 
      payout_id AS payoutId, 
      created_at AS createdAt 
     FROM wallet_entries 
     WHERE wallet_id = ? 
     ORDER BY created_at DESC 
     LIMIT 20`,
    [mentorId]
  );

  const [accounts] = await db.query(
    `SELECT 
      id, 
      mentor_id AS mentorId, 
      bank_name AS bankName, 
      account_number AS accountNumber, 
      account_name AS accountName, 
      is_verified AS isVerified, 
      is_primary AS isPrimary, 
      created_at AS createdAt
     FROM payout_accounts 
     WHERE mentor_id = ? 
     ORDER BY is_primary DESC`,
    [mentorId]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS count 
     FROM bookings 
     WHERE mentor_id = ? AND status IN ('dibayar', 'diterima')`,
    [mentorId]
  );

  return {
    wallet: {
      userId: w.user_id,
      availableBalance: w.available_balance,
      escrowBalance: w.escrow_balance,
      totalEarnings: w.total_earnings,
    },
    entries,
    accounts,
    escrowSessions: countRows[0]?.count ?? 0,
  };
}

/**
 * Ajukan pencairan dana. Atomik:
 *   1. Validasi amount ≤ availableBalance
 *   2. Buat Payout (status `selesai`)
 *   3. availableBalance -= amount
 *   4. WalletEntry tipe `out`
 *   5. Notifikasi "pencairan berhasil"
 */
export async function requestPayout(mentorId, amount, accountId) {
  return withTransaction(async (conn) => {
    const [walletRows] = await conn.query(
      "SELECT available_balance FROM wallets WHERE user_id = ? FOR UPDATE",
      [mentorId]
    );
    const wallet = walletRows[0];
    if (!wallet) throw new PayoutError("Dompet tidak ditemukan.");
    if (amount > wallet.available_balance) {
      throw new PayoutError("Saldo tersedia tidak cukup untuk pencairan ini.");
    }

    const [accountRows] = await conn.query(
      "SELECT id, bank_name, account_number FROM payout_accounts WHERE id = ? AND mentor_id = ?",
      [accountId, mentorId]
    );
    const account = accountRows[0];
    if (!account) throw new PayoutError("Rekening tujuan tidak valid.");

    const payoutId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO payouts (id, mentor_id, account_id, amount, status, requested_at, completed_at)
       VALUES (?, ?, ?, ?, 'selesai', NOW(), NOW())`,
      [payoutId, mentorId, accountId, amount]
    );

    await conn.query(
      "UPDATE wallets SET available_balance = available_balance - ? WHERE user_id = ?",
      [amount, mentorId]
    );

    const entryId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO wallet_entries (id, wallet_id, type, amount, description, payout_id, created_at)
       VALUES (?, ?, 'out', ?, ?, ?, NOW())`,
      [
        entryId,
        mentorId,
        amount,
        `Pencairan ke ${account.bank_name} ****${account.account_number.slice(-4)}`,
        payoutId,
      ]
    );

    const notifId = crypto.randomUUID();
    await conn.query(
      `INSERT INTO notifications (id, user_id, category, title, body, created_at)
       VALUES (?, ?, 'sistem', 'Pencairan berhasil', ?, NOW())`,
      [
        notifId,
        mentorId,
        `Pencairan Rp${amount.toLocaleString("id-ID")} ke ${account.bank_name} telah diproses.`,
      ]
    );

    return {
      id: payoutId,
      mentorId,
      accountId,
      amount,
      status: "selesai",
    };
  });
}

/**
 * Simpan atau perbarui rekening pencairan bank mentor.
 */
export async function savePayoutAccount(mentorId, { bankName, accountNumber, accountName }) {
  const [existing] = await db.query(
    "SELECT id FROM payout_accounts WHERE mentor_id = ? ORDER BY is_primary DESC LIMIT 1",
    [mentorId]
  );

  if (existing.length > 0) {
    const accountId = existing[0].id;
    await db.query(
      `UPDATE payout_accounts 
       SET bank_name = ?, account_number = ?, account_name = ?, is_verified = 1
       WHERE id = ?`,
      [bankName, accountNumber, accountName, accountId]
    );
    return {
      id: accountId,
      mentorId,
      bankName,
      accountNumber,
      accountName,
      isVerified: 1,
      isPrimary: 1,
    };
  }

  const id = crypto.randomUUID();
  await db.query(
    `INSERT INTO payout_accounts 
      (id, mentor_id, bank_name, account_number, account_name, is_verified, is_primary)
     VALUES (?, ?, ?, ?, ?, 1, 1)`,
    [id, mentorId, bankName, accountNumber, accountName]
  );

  return {
    id,
    mentorId,
    bankName,
    accountNumber,
    accountName,
    isVerified: 1,
    isPrimary: 1,
  };
}

