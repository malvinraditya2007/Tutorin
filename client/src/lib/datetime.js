/**
 * Util format tanggal & waktu terpusat (locale id-ID).
 *
 * Menerima `Date` maupun ISO string agar bisa dipakai di Server Component
 * (umumnya `Date`) maupun Client Component (umumnya ISO string hasil
 * serialisasi server→client).
 */
const toDate = (input) => input instanceof Date ? input : new Date(input);
/** Format tanggal dengan opsi Intl bebas (default id-ID). */
export function formatDate(input, options) {
    return toDate(input).toLocaleDateString("id-ID", options);
}
/** Format jam:menit, mis. "19.00". */
export function formatTime(input) {
    return toDate(input).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
/** Format ringkas untuk timestamp notifikasi, mis. "07 Okt, 14.48". */
export function formatNotifTime(input) {
    return toDate(input).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}
