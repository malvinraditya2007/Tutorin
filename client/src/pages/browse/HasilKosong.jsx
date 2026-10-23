import * as React from "react";
import Link from "@/lib/link";
import { Search, SearchX, X, RotateCcw, Lightbulb, ArrowRight } from "lucide-react";
import { Button, Footer } from "@/components/ui";

const ACTIVE_FILTERS = ["Ekonometrika Lanjut", "< Rp50rb", "Rating 4.9+", "Online"];

const SUGGESTIONS = [
  { title: "Longgarkan rentang harga", desc: "Naikkan batas harga untuk melihat lebih banyak tutor." },
  { title: "Kurangi filter rating", desc: "Coba rating 4.5+ agar hasilnya lebih luas." },
  { title: "Cari mata kuliah terkait", desc: "Misalnya 'Statistika' atau 'Ekonometrika Dasar'." },
];

export default function HasilKosongPage() {
  return (
    <>
      {/* Search summary */}
      <section className="flex flex-col items-center gap-[18px] px-20 pb-11 pt-9">
        <h1 className="text-center text-4xl font-black text-ink">
          Cari tutor untuk kebutuhan belajarmu.
        </h1>
        <form className="flex h-[66px] w-[850px] max-w-full items-center gap-3.5 rounded-[18px] border border-cream-border bg-white py-2 pl-5 pr-[9px] shadow-[0px_10px_28px_0px_rgba(23,59,54,0.09)]">
          <Search className="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            aria-label="Cari tutor"
            defaultValue="Ekonometrika Lanjut"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
          <button
            type="submit"
            aria-label="Cari"
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-star text-white transition-opacity hover:opacity-90"
          >
            <Search className="size-[18px]" aria-hidden="true" />
          </button>
        </form>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-ink-muted">Filter aktif:</span>
          {ACTIVE_FILTERS.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-2.5 py-[7px] text-[11px] font-bold text-brand-650"
            >
              {f}
              <X className="size-3" aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      {/* Empty results */}
      <section className="flex gap-7 bg-surface px-20 pb-16 pt-12">
        {/* Filters */}
        <aside className="flex w-[270px] shrink-0 flex-col gap-5 self-start rounded-[18px] border border-cream-border bg-white p-[22px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-ink">Filter</span>
            <button type="button" className="text-xs font-bold text-brand-650">
              Reset
            </button>
          </div>
          {["Mata kuliah", "Rentang harga", "Rating minimum"].map((title) => (
            <div key={title} className="flex flex-col gap-2 border-t border-cream-border pt-4 first:border-t-0 first:pt-0">
              <span className="text-xs font-bold text-ink">{title}</span>
              <p className="text-xs text-ink-muted">Beberapa opsi tersedia.</p>
            </div>
          ))}
        </aside>

        {/* Empty content */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col items-center gap-[18px] rounded-3xl border border-cream-border bg-white px-16 py-11 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-brand-tint text-brand-650">
              <SearchX className="size-7" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-extrabold text-ink">
                Belum ada tutor yang cocok
              </h2>
              <p className="max-w-md text-sm text-ink-muted">
                Pencarian untuk{" "}
                <span className="font-bold text-ink">“Ekonometrika Lanjut”</span>{" "}
                dengan filter saat ini tidak menemukan tutor. Coba sesuaikan
                filter atau kata kunci.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="light" leftIcon={<RotateCcw className="size-[18px]" />}>
                Reset filter
              </Button>
              <Link href="/cari-tutor">
                <Button rightIcon={<ArrowRight className="size-[18px]" />}>
                  Jelajahi semua tutor
                </Button>
              </Link>
            </div>
          </div>

          {/* Alternatives */}
          <div className="flex flex-col gap-3.5">
            <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Lightbulb className="size-4 text-star" aria-hidden="true" />
              Saran untuk memperluas hasil
            </span>
            {SUGGESTIONS.map((s) => (
              <div
                key={s.title}
                className="flex items-center justify-between rounded-[18px] border border-cream-border bg-white p-5"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-ink">{s.title}</span>
                  <span className="text-xs text-ink-muted">{s.desc}</span>
                </div>
                <ArrowRight className="size-5 text-ink-muted" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
