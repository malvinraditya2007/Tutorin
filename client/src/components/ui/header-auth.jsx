import * as React from "react";
import Link from "@/lib/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
/**
 * HeaderAuth — header transparan minimal untuk halaman auth/onboarding.
 *
 * Mengikuti Figma node 1:5317: logo Tutorin di kiri dan tautan teal
 * "← Kembali ke Beranda" di kanan, tanpa latar atau border.
 *
 * @example
 * <HeaderAuth />
 */
export function HeaderAuth({ homeHref = "/", className, ...props }) {
    return (<header className={cn("flex h-[84px] items-center justify-between px-[52px]", className)} {...props}>
      <Link href={homeHref} aria-label="Tutorin — beranda" className="shrink-0">
        <Logo />
      </Link>

      <Link href={homeHref} className="inline-flex items-center gap-2 px-1 py-2 text-[13px] font-bold text-brand-650 transition-opacity hover:opacity-80">
        <ArrowLeft className="size-4" aria-hidden="true"/>
        Kembali ke Beranda
      </Link>
    </header>);
}
