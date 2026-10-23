import * as React from "react";
import { cn } from "@/lib/utils";
/**
 * Eyebrow — label kecil huruf kapital, biasanya di atas judul section.
 *
 * Mengikuti Figma node 1:5524: pill teal lembut (radius 999px, padding 7px/13px)
 * dengan teks kapital extrabold berwarna brand.
 *
 * @example
 * <Eyebrow>Pilihan komunitas</Eyebrow>
 */
export function Eyebrow({ className, children, ...props }) {
    return (<span className={cn("inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider leading-none text-brand-700", className)} {...props}>
      {children}
    </span>);
}
