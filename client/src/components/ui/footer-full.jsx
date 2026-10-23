import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * FooterFull — footer situs minimalis terpusat untuk Tutorin.
 */
export function FooterFull({ tagline = '"Peer-to-Peer Learning. Dari Kampus, untuk Kampus."', description = "Platform peer-tutoring komunitas yang membuat belajar privat 1-on-1 jadi mudah, aman, dan terjangkau.", copyright, locale = "Stop belajar sendiri, start Tutorin.", className, ...props }) {
    return (<footer className={cn("flex flex-col gap-10 bg-ink px-20 pb-8 pt-14 text-white", className)} {...props}>
      <div className="mx-auto flex max-w-md flex-col items-center gap-1.5 text-center">
        <p className="text-[13px] text-slate-300">{tagline}</p>
        <p className="text-[13px] leading-relaxed text-footer-link">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <span className="inline-flex items-center gap-1 text-xs text-footer-muted">
          {copyright ?? (<>
              © 2026 Tutorin. Made with{" "}
              <Heart className="inline size-3.5 fill-brand-500 text-brand-500" aria-label="love"/>{" "}
              for Indonesian students.
            </>)}
        </span>
        <span className="text-xs text-footer-muted">{locale}</span>
      </div>
    </footer>);
}
