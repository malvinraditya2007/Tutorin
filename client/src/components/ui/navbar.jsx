import * as React from "react";
import Link from "@/lib/link";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
const DEFAULT_ITEMS = [
    { label: "Beranda", href: "/" },
    { label: "Cari Tutor", href: "/cari-tutor" },
    { label: "Jadi Mentor", href: "/jadi-mentor" },
];
/**
 * Navbar — navigasi atas publik (belum login).
 *
 * Mengikuti Figma node 1-5295: bar cream dengan logo Tutorin, menu di tengah
 * dengan garis bawah pada tautan aktif, tautan teks "Masuk", dan CTA pill
 * "Daftar gratis".
 *
 * @example
 * <Navbar activeHref="/cari-tutor" />
 */
export function Navbar({ items = DEFAULT_ITEMS, activeHref = "/", signInHref = "/login", registerHref = "/daftar", className, ...props }) {
    return (<nav className={cn("sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-neutral-200/70 bg-white/90 px-20 backdrop-blur-md", className)} aria-label="Utama" {...props}>
      <Link href="/" aria-label="Tutorin — beranda" className="shrink-0">
        <Logo />
      </Link>

      <ul className="flex items-center gap-7">
        {items.map((item) => {
            const isActive = item.href === activeHref;
            return (<li key={item.href} className="flex flex-col items-center gap-1.5">
              <Link href={item.href} aria-current={isActive ? "page" : undefined} className={cn("text-sm leading-none transition-colors hover:text-brand-700", isActive
                    ? "font-semibold text-brand-700"
                    : "font-medium text-neutral-600")}>
                {item.label}
              </Link>
              <span aria-hidden="true" className={cn("h-0.5 w-6 rounded-full transition-colors", isActive ? "bg-brand-600" : "bg-transparent")}/>
            </li>);
        })}
      </ul>

      <div className="flex items-center gap-4">
        <Link href={signInHref} className="text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-700">
          Masuk
        </Link>
        <Link href={registerHref} className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-500 px-5 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-brand-600 active:scale-[0.98]">
          Daftar gratis
        </Link>
      </div>
    </nav>);
}
