import { Router } from "express";
import { asyncHandler, requireRole, requireUser } from "../middleware/auth.js";
import { createBookingSchema, requestPayoutSchema, savePayoutAccountSchema } from "../schemas/index.js";
import { createBooking, BookingError } from "../services/booking.js";
import { payBooking, PaymentError } from "../services/payment.js";
import { createReview, listReviewableBookings, listSubmittedReviews, ReviewError } from "../services/review.js";
import { settleDueSessions } from "../services/escrow.js";
import { listNotifications, markAllRead } from "../services/notification.js";
import { addSlot, removeSlot, listSlots, SlotError } from "../services/slot.js";
import {
  getMentorProfile,
  updateMentorProfile,
  MentorError,
} from "../services/mentor.js";
import { getWalletOverview, requestPayout, savePayoutAccount, PayoutError } from "../services/wallet.js";
import {
  getBookingDetail,
  getStudentSessions,
  getStudentTransactions,
  getStudentTransactionSummary,
  getMentorRequests,
} from "../lib/bookings.js";

const router = Router();
const PAYMENT_METHODS = ["ewallet", "va", "card"];
const firstError = (parsed) => parsed.error.issues[0]?.message ?? "Input tidak valid.";

// ---------- Mahasiswa ----------

/** Buat booking (status menunggu_pembayaran). Mengembalikan { id }. */
router.post(
  "/bookings",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    const parsed = createBookingSchema.safeParse({
      ...req.body,
      durationMinutes: Number(req.body?.durationMinutes),
      topic: req.body?.topic || undefined,
    });
    if (!parsed.success) return res.status(400).json({ error: firstError(parsed) });
    try {
      const booking = await createBooking(req.user.id, parsed.data);
      res.status(201).json({ id: booking.id });
    } catch (e) {
      if (e instanceof BookingError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

router.get(
  "/bookings/:id",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    const booking = await getBookingDetail(req.params.id, req.user.id);
    if (!booking) return res.status(404).json({ error: "Booking tidak ditemukan." });
    res.json({ booking });
  })
);

/** Bayar booking (simulasi gateway). */
router.post(
  "/bookings/:id/pay",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    const method = PAYMENT_METHODS.includes(req.body?.method) ? req.body.method : "ewallet";
    try {
      await payBooking(req.user.id, req.params.id, method);
      res.json({ ok: true });
    } catch (e) {
      if (e instanceof PaymentError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

router.get(
  "/student/sessions",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    await settleDueSessions();
    res.json(await getStudentSessions(req.user.id));
  })
);

router.get(
  "/student/transactions",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    await settleDueSessions();
    const [transactions, summary] = await Promise.all([
      getStudentTransactions(req.user.id),
      getStudentTransactionSummary(req.user.id),
    ]);
    res.json({ transactions, summary });
  })
);

router.get(
  "/reviews/reviewable",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    await settleDueSessions();
    res.json({ bookings: await listReviewableBookings(req.user.id) });
  })
);

router.get(
  "/reviews/submitted",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    res.json({ reviews: await listSubmittedReviews(req.user.id) });
  })
);

router.post(
  "/reviews",
  requireRole("mahasiswa"),
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    if (!b.bookingId) return res.status(400).json({ error: "Booking tidak valid." });
    try {
      await createReview({
        studentId: req.user.id,
        bookingId: String(b.bookingId),
        rating: Number(b.rating),
        comment: String(b.comment ?? ""),
        highlightLabels: Array.isArray(b.highlights) ? b.highlights.map(String) : [],
        isAnonymous: Boolean(b.isAnonymous),
      });
      res.status(201).json({ ok: true });
    } catch (e) {
      if (e instanceof ReviewError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

// ---------- Notifikasi (semua peran) ----------

router.get(
  "/notifications",
  requireUser,
  asyncHandler(async (req, res) => {
    res.json({ notifications: await listNotifications(req.user.id) });
  })
);

router.post(
  "/notifications/read-all",
  requireUser,
  asyncHandler(async (req, res) => {
    await markAllRead(req.user.id);
    res.json({ ok: true });
  })
);

// ---------- Mentor ----------

router.get(
  "/mentor/profile",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    res.json({ profile: await getMentorProfile(req.user.id) });
  })
);

router.put(
  "/mentor/profile",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    const b = req.body ?? {};
    const avatarUrl =
      typeof b.avatarUrl === "string" ? b.avatarUrl.trim() || null : undefined;
    try {
      await updateMentorProfile(req.user.id, {
        fullName: String(b.fullName ?? ""),
        university: String(b.university ?? ""),
        studyProgram: String(b.studyProgram ?? ""),
        bio: String(b.bio ?? ""),
        headline: String(b.headline ?? ""),
        hourlyRate: Number(b.hourlyRate),
        discordUrl: String(b.discordUrl ?? ""),
        isPublished: true,
        subjectIds: Array.isArray(b.subjectIds) ? b.subjectIds.map(String) : [],
        avatarUrl,
      });
      res.json({ ok: true });
    } catch (e) {
      if (e instanceof MentorError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

router.get(
  "/mentor/requests",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    await settleDueSessions();
    res.json(await getMentorRequests(req.user.id));
  })
);

router.get(
  "/mentor/slots",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    const from = new Date(String(req.query.from ?? ""));
    const to = new Date(String(req.query.to ?? ""));
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ error: "Rentang waktu tidak valid." });
    }
    res.json({ slots: await listSlots(req.user.id, from, to) });
  })
);

router.post(
  "/mentor/slots",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    const startsAt = new Date(String(req.body?.startsAt ?? ""));
    if (isNaN(startsAt.getTime())) return res.status(400).json({ error: "Waktu tidak valid." });
    try {
      res.status(201).json({ slot: await addSlot(req.user.id, startsAt) });
    } catch (e) {
      if (e instanceof SlotError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

router.delete(
  "/mentor/slots/:id",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    try {
      await removeSlot(req.user.id, req.params.id);
      res.json({ ok: true });
    } catch (e) {
      if (e instanceof SlotError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

router.get(
  "/mentor/wallet",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    await settleDueSessions();
    res.json(await getWalletOverview(req.user.id));
  })
);

router.post(
  "/mentor/payouts",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    const parsed = requestPayoutSchema.safeParse({
      amount: Number(req.body?.amount),
      accountId: String(req.body?.accountId ?? ""),
    });
    if (!parsed.success) return res.status(400).json({ error: firstError(parsed) });
    try {
      await requestPayout(req.user.id, parsed.data.amount, parsed.data.accountId);
      res.status(201).json({ ok: true });
    } catch (e) {
      if (e instanceof PayoutError) return res.status(400).json({ error: e.message });
      throw e;
    }
  })
);

router.post(
  "/mentor/payout-account",
  requireRole("mentor"),
  asyncHandler(async (req, res) => {
    const parsed = savePayoutAccountSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: firstError(parsed) });
    const account = await savePayoutAccount(req.user.id, parsed.data);
    res.status(200).json({ ok: true, account });
  })
);

export default router;

