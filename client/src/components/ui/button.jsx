import * as React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * Varian Button — dari component set Figma (node 1:5490).
 *
 * Tiga varian: primary (teal), light (putih), dark (ink). Semua dirender
 * sebagai pill (radius 999px), tinggi 52px, padding horizontal 22px, teks 14px tebal.
 */
const buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight whitespace-nowrap outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-600 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none", {
    variants: {
        variant: {
            // Teal brand — aksi utama/navigasi (default).
            primary: "bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-700",
            // Coral — tombol konversi (Booking, Bayar, Daftar). Brief accent.
            accent: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-600",
            // Netral di atas cream — aksi sekunder.
            light: "bg-white text-ink border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100",
            // Outline tipis.
            outline: "bg-transparent text-brand-700 border border-brand-200 hover:bg-brand-50 active:bg-brand-100",
            // Slate charcoal.
            dark: "bg-sidebar text-white hover:bg-sidebar/90 active:bg-sidebar/80",
        },
        size: {
            sm: "h-9 px-4 text-sm",
            md: "h-11 px-5 text-sm",
            lg: "h-12 px-6 text-base",
        },
        fullWidth: {
            true: "w-full",
            false: "",
        },
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
        fullWidth: false,
    },
});
/**
 * Button — kontrol interaktif utama.
 *
 * Mengikuti Figma node 1:5490. Varian: primary, light, dark. Mendukung ukuran,
 * state loading, slot ikon, dan layout full-width.
 *
 * @example
 * <Button rightIcon={<ArrowRight className="size-[18px]" />}>Jelajahi semua tutor</Button>
 * <Button variant="dark">Cari tutor sekarang</Button>
 */
export const Button = React.forwardRef(({ className, variant, size, fullWidth, isLoading = false, leftIcon, rightIcon, disabled, children, ...props }, ref) => {
    return (<button ref={ref} className={cn(buttonVariants({ variant, size, fullWidth }), className)} disabled={disabled || isLoading} aria-busy={isLoading || undefined} {...props}>
        {isLoading ? (<Loader2 className="size-[18px] animate-spin" aria-hidden="true"/>) : (leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>)}
        {children}
        {!isLoading && rightIcon && (<span className="inline-flex shrink-0">{rightIcon}</span>)}
      </button>);
});
Button.displayName = "Button";
