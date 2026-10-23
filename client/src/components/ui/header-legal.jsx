import * as React from "react";
import Link from "@/lib/link";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
/**
 * HeaderLegal — header ringkas untuk halaman legal/statis.
 *
 * Mengikuti Figma node 1-5325: bar cream dengan border bawah, logo Tutorin
 * di kiri, dan label konteks rata kanan + pembatas +
 * tautan "Kembali ke Beranda".
 *
 * @example
 * <HeaderLegal pageLabel="Kebijakan Privasi" />
 */
export function HeaderLegal({ pageLabel = "Kebijakan Privasi", homeHref = "/", className, ...props }) {
    return (<header className={cn("flex h-[72px] items-center justify-between border-b border-neutral-200/70 bg-cream px-16", className)} {...props}>
      <Link href={homeHref} aria-label="Tutorin — beranda" className="shrink-0">
        <Logo />
      </Link>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider leading-none text-brand-700">
          {pageLabel}
        </span>
        <span aria-hidden="true" className="h-4 w-px bg-neutral-200"/>
        <Link href={homeHref} className="text-sm font-medium leading-none text-neutral-700 transition-colors hover:text-brand-700">
          Kembali ke Beranda
        </Link>
      </div>
    </header>);
}
