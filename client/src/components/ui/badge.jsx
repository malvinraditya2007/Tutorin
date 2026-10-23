import * as React from "react";
import { cva } from "class-variance-authority";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * Varian Badge — dari component set Figma (node 1:5503).
 *
 * Dua tipe:
 * - `status`: pill teal lembut dengan label kapital tebal (mis. "TERSEDIA")
 * - `verified`: pill putih dengan ikon centang + label (mis. "Terverifikasi")
 */
const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono leading-none whitespace-nowrap", {
    variants: {
        type: {
            status: "bg-brand-50 text-[10px] font-semibold uppercase tracking-wider text-brand-700",
            verified: "bg-white border border-neutral-200 text-[10px] font-semibold text-brand-700",
        },
    },
    defaultVariants: { type: "status" },
});
/**
 * Badge — pill kecil untuk status/verifikasi.
 *
 * Mengikuti Figma node 1:5503. Tipe `verified` otomatis menampilkan ikon
 * centang; `status` menampilkan label kapital polos.
 *
 * @example
 * <Badge type="status">Tersedia</Badge>
 * <Badge type="verified">Terverifikasi</Badge>
 */
export function Badge({ className, type, children, ...props }) {
    return (<span className={cn(badgeVariants({ type }), className)} {...props}>
      {type === "verified" && (<BadgeCheck className="size-[15px] shrink-0" aria-hidden="true"/>)}
      {children}
    </span>);
}
