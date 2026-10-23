/**
 * Modul fee terpusat (SPECS §10: perhitungan fee di satu tempat).
 *
 * MODEL A (keputusan user):
 *   - Mahasiswa membayar: tarif tutor + biaya layanan 8%.
 *   - Mentor menerima: tarif tutor PENUH (biaya layanan adalah pendapatan platform,
 *     ditanggung mahasiswa di atas tarif).
 *
 * Contoh: tarif Rp65.000 → biaya layanan Rp5.200 → total mahasiswa Rp70.200,
 * mentor terima Rp65.000.
 */

/** Rasio biaya layanan yang dibebankan ke mahasiswa, di atas tarif tutor. */
export const SERVICE_FEE_RATE = 0.08;

/**
 * Hitung rincian biaya dari tarif per jam dan durasi sesi (45 | 60 | 90).
 * Mengembalikan { amount, serviceFee, total, mentorEarning }.
 */
export function computeFees(hourlyRate, durationMinutes) {
  const amount = Math.round((hourlyRate * durationMinutes) / 60);
  const serviceFee = Math.round(amount * SERVICE_FEE_RATE);
  return {
    amount,
    serviceFee,
    total: amount + serviceFee,
    mentorEarning: amount,
  };
}

/** Peta enum durasi Prisma (m45/m60/m90) ke angka menit. */
export const DURATION_MINUTES = { m45: 45, m60: 60, m90: 90 };

/** Kebalikannya: angka menit → nilai enum Prisma SessionDuration. */
export function minutesToDurationEnum(minutes) {
  if (minutes === 45) return "m45";
  if (minutes === 90) return "m90";
  return "m60";
}
