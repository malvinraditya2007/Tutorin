import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

const SUBJECT_OPTIONS = [
  "Kalkulus",
  "Statistika",
  "Pemrograman",
  "Struktur Data",
  "Fisika Dasar",
  "Akuntansi",
  "Basis Data",
];

const PRICE_OPTIONS = [
  { label: "Semua harga", value: "" },
  { label: "< Rp60rb", value: "0-60000" },
  { label: "Rp60rb–80rb", value: "60000-80000" },
  { label: "> Rp80rb", value: "80000-9999999" },
];

const SORT_OPTIONS = [
  { label: "Rating tertinggi", value: "rating" },
  { label: "Harga terendah", value: "price_asc" },
  { label: "Sesi terbanyak", value: "sessions" },
];

export function SearchFilterBar({ totalCount }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentSubject = searchParams.get("subjects") ?? "";
  const currentPrice = searchParams.get("prices") ?? "";
  const currentSort = searchParams.get("sort") ?? "rating";

  const [query, setQuery] = React.useState(currentSearch);

  React.useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentSearch) {
        updateParam("search", query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const hasActiveFilters = Boolean(currentSearch || currentSubject || currentPrice);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5">
      {/* Top row: Search input + Price filter + Sort dropdown */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 px-3.5 transition focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/15">
          <Search
            size={17}
            strokeWidth={1.75}
            className="shrink-0 text-neutral-400"
            aria-hidden="true"
          />
          <input
            type="text"
            aria-label="Cari mata kuliah, kampus, atau nama tutor"
            placeholder="Cari mata kuliah, jurusan, kampus, atau nama tutor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                updateParam("search", "");
              }}
              aria-label="Hapus pencarian"
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Filter rentang harga"
            value={currentPrice}
            onChange={(e) => updateParam("prices", e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-700 outline-none transition hover:border-neutral-300 focus:border-brand-500"
          >
            {PRICE_OPTIONS.map((p) => (
              <option key={p.label} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Urutkan tutor"
            value={currentSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-white px-3.5 text-xs font-semibold text-neutral-700 outline-none transition hover:border-neutral-300 focus:border-brand-500"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                Urutkan: {s.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Subject filter pills + result count */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => updateParam("subjects", "")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              currentSubject === ""
                ? "bg-brand-600 text-white"
                : "border border-neutral-200/80 bg-white text-neutral-600 hover:border-brand-300 hover:text-neutral-900"
            }`}
          >
            Semua
          </button>
          {SUBJECT_OPTIONS.map((sub) => {
            const active = currentSubject === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => updateParam("subjects", active ? "" : sub)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-brand-600 text-white"
                    : "border border-neutral-200/80 bg-white text-neutral-600 hover:border-brand-300 hover:text-neutral-900"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-medium text-neutral-400">
          {totalCount} tutor ditemukan
        </span>
      </div>
    </div>
  );
}
