import * as React from "react";
import { cn } from "@/lib/utils";
/**
 * ProofItem — satu poin statistik/bukti, biasanya ditampilkan berjajar di atas
 * latar hero gelap (teal/ink).
 *
 * Mengikuti Figma node 1:5543: nilai warna peach di atas label teal-abu lembut.
 *
 * @example
 * <ProofItem value="3,7+" label="IPK minimum tutor" />
 */
export function ProofItem({ value, label, className, ...props }) {
    return (<div className={cn("flex flex-col gap-1", className)} {...props}>
      <span className="font-mono text-2xl font-semibold tracking-tight leading-none text-white">
        {value}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-wider leading-snug text-proof-label">
        {label}
      </span>
    </div>);
}
