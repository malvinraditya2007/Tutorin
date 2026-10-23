import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
/**
 * Varian ukuran Logo.
 *
 * Nilai diturunkan dari logo Figma (node 1-5291): mark persegi membulat teal
 * berisi huruf "T" tebal, diikuti wordmark "Tutorin". Ukuran `md`
 * mereproduksi spec Figma 1:1 (mark 38.42px, teks mark 22px,
 * wordmark 24px); ukuran lain menyesuaikan secara proporsional.
 */
const markVariants = cva("inline-flex items-center justify-center shrink-0 rounded-[12px] font-[family-name:var(--font-sans)] font-extrabold leading-none text-white", {
    variants: {
        size: {
            sm: "size-7 text-base rounded-[9px]",
            md: "size-[38.42px] text-[22px]",
            lg: "size-12 text-[28px] rounded-[15px]",
        },
        markColor: {
            teal: "bg-brand-500",
            warm: "bg-star",
        },
    },
    defaultVariants: { size: "md", markColor: "teal" },
});
const wordmarkVariants = cva("font-[family-name:var(--font-sans)] font-extrabold leading-none tracking-tight", {
    variants: {
        size: {
            sm: "text-lg",
            md: "text-[24px]",
            lg: "text-[30px]",
        },
        tone: {
            dark: "text-ink",
            light: "text-white",
        },
    },
    defaultVariants: { size: "md", tone: "dark" },
});
// `markColor` berasal dari markVariants (default teal, warm untuk mark oranye
// di Footer/Full). `tone` mengatur warna wordmark.
/**
 * Logo — lockup brand Tutorin (mark + wordmark "Tutorin").
 *
 * Mengikuti Figma node 1-5291. Gunakan `markOnly` untuk penempatan ringkas
 * seperti favicon, header mobile, atau avatar.
 *
 * @example
 * <Logo />
 * <Logo size="lg" />
 * <Logo markOnly />
 * <Logo tone="light" /> // untuk latar gelap (footer)
 */
export function Logo({ className, size, markColor, markOnly, tone = "dark", ...props }) {
    return (<span className={cn("inline-flex items-center gap-2.5", className)} aria-label="Tutorin" role="img" {...props}>
      <span className={markVariants({ size, markColor })} aria-hidden="true">
        T
      </span>
      {!markOnly && (<span className={wordmarkVariants({ size, tone })} aria-hidden="true">
          Tutorin
        </span>)}
    </span>);
}
