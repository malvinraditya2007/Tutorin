import { z } from "zod";

/** Validasi input autentikasi email/password. */
export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password terlalu panjang"),
  role: z.enum(["mahasiswa", "mentor"]),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

/** Skema validasi input untuk alur booking. */
export const createBookingSchema = z.object({
  mentorId: z.string().uuid("Mentor tidak valid"),
  subjectId: z.string().uuid("Mata kuliah tidak valid"),
  slotId: z.string().uuid("Slot tidak valid"),
  durationMinutes: z.union([z.literal(45), z.literal(60), z.literal(90)]),
  mode: z.enum(["online", "offline"]),
  topic: z.string().trim().max(200).optional(),
});

/**
 * Validasi input pencairan dana mentor.
 * SPECS §12: transfer bank, tanpa nominal minimum, tanpa biaya.
 */
export const requestPayoutSchema = z.object({
  amount: z
    .number()
    .int("Nominal harus bilangan bulat")
    .positive("Nominal harus lebih dari 0"),
  accountId: z.string().uuid("Rekening tidak valid"),
});

export const savePayoutAccountSchema = z.object({
  bankName: z.string().trim().min(2, "Nama bank wajib dipilih").max(50),
  accountNumber: z.string().trim().min(5, "Nomor rekening minimal 5 angka").max(30),
  accountName: z.string().trim().min(2, "Nama pemilik rekening minimal 2 karakter").max(100),
});
