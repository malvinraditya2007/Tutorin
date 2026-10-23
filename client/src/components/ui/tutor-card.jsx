import * as React from "react";
import Link from "@/lib/link";
import { Star, ArrowRight, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { rp } from "@/lib/money";
export function TutorCard({ name, program, subject, subjects, headline, sessionsCompleted, photoUrl, rating, reviewCount, pricePerHour, verified = false, bookingHref = "/checkout", bookingLabel = "Lihat profil", className, ...props }) {
    const ratingLabel = rating.toLocaleString("id-ID", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
    const displaySubjects = subjects && subjects.length > 0 ? subjects : [subject];
    const isDefaultAvatar = !photoUrl || photoUrl === "/avatar-default.svg";
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
    return (<div className={cn("group flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 transition duration-150 hover:border-brand-300 hover:shadow-md", className)} {...props}>
      <div className="flex flex-col gap-3.5">
        {/* Top Row: Avatar + Name/Program + Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            {isDefaultAvatar ? (<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-inset ring-brand-500/20">
                {initials}
              </span>) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt={name} className="size-12 shrink-0 rounded-full bg-neutral-100 object-cover ring-1 ring-neutral-200"/>)}
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-base font-bold tracking-tight text-neutral-900 group-hover:text-brand-700">
                  {name}
                </span>
                {verified && (<BadgeCheck size={15} strokeWidth={2} className="shrink-0 text-brand-600" aria-label="Terverifikasi"/>)}
              </div>
              <span className="truncate text-xs text-neutral-500">{program}</span>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-900 ring-1 ring-inset ring-neutral-200/70">
            <Star className="size-3.5 fill-star text-star" aria-hidden="true"/>
            <span>{ratingLabel}</span>
            <span className="font-normal text-neutral-400">({reviewCount})</span>
          </span>
        </div>

        {/* Headline */}
        {headline && (<p className="line-clamp-2 text-xs leading-relaxed text-neutral-600">
            {headline}
          </p>)}

        {/* Subject Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {displaySubjects.slice(0, 3).map((sub) => (<span key={sub} className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
              {sub}
            </span>))}
          {displaySubjects.length > 3 && (<span className="rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-500">
              +{displaySubjects.length - 3}
            </span>)}
        </div>
      </div>

      {/* Footer: Price + CTA */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-extrabold tracking-tight text-neutral-900">
            {rp(pricePerHour)}
            <span className="text-xs font-normal text-neutral-400"> / jam</span>
          </span>
          {sessionsCompleted != null && sessionsCompleted > 0 && (<span className="text-[11px] text-neutral-400">
              {sessionsCompleted} sesi selesai
            </span>)}
        </div>

        <Link href={bookingHref} className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition duration-150 hover:bg-brand-600 active:scale-[0.98]">
          {bookingLabel}
          <ArrowRight size={14} strokeWidth={2} aria-hidden="true"/>
        </Link>
      </div>
    </div>);
}
