/**
 * Util format mata uang Rupiah untuk tampilan.
 */
const rupiah = new Intl.NumberFormat("id-ID");
/** Format dengan prefix "Rp", mis. 70200 → "Rp70.200". */
export function rp(n) {
    return `Rp${rupiah.format(n)}`;
}
/** Format bertanda untuk mutasi dompet, mis. +Rp65.000 / −Rp50.000. */
export function rpSigned(n, type) {
    const sign = type === "in" ? "+" : "−";
    return `${sign}Rp${rupiah.format(Math.abs(n))}`;
}
