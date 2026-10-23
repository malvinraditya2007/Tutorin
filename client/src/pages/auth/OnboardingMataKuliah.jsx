import * as React from "react";
import Link from "@/lib/link";
import { Search, ArrowRight, Check } from "lucide-react";
const STEPS = [
    { label: "Akun", state: "done" },
    { label: "Mata kuliah", state: "active" },
    { label: "Profil & slot", state: "upcoming" },
];
const SUBJECTS = [
    "Kalkulus",
    "Statistika",
    "Pemrograman",
    "Struktur Data",
    "Fisika Dasar",
    "Kimia Dasar",
    "Ekonomi Mikro",
    "Akuntansi",
    "Basis Data",
    "Aljabar Linear",
];
const MAX = 8;
export default function OnboardingMataKuliahPage() {
    const [selected, setSelected] = React.useState([
        "Kalkulus",
        "Statistika",
        "Struktur Data",
    ]);
    const toggle = (subject) => {
        setSelected((prev) => prev.includes(subject)
            ? prev.filter((s) => s !== subject)
            : prev.length < MAX
                ? [...prev, subject]
                : prev);
    };
    return (<div className="flex flex-col items-center">
      <div className="flex w-[560px] max-w-full flex-col gap-[22px] px-4 pb-14 pt-10">
        {/* Stepper */}
        <div className="flex gap-2.5">
          {STEPS.map((step, i) => (<div key={step.label} className="flex flex-1 flex-col gap-2">
              <span className={`h-1 rounded-full ${step.state === "upcoming" ? "bg-neutral-200" : "bg-brand-500"}`}/>
              <span className={`font-mono text-[11px] ${step.state === "active"
                ? "font-semibold text-neutral-900"
                : "text-neutral-400"}`}>
                {step.state === "done" ? "✓ " : ""}
                {i + 1}. {step.label}
              </span>
            </div>))}
        </div>

        {/* Eyebrow */}
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-700">
          Langkah 2 dari 3
        </span>

        {/* Heading */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Pilih mata kuliah
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-neutral-600">
            Pilih mata kuliah yang kamu kuasai. Kamu bisa menambah atau
            mengubahnya nanti.
          </p>
        </div>

        {/* Form card */}
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject-search" className="text-xs font-medium text-neutral-700">
              Cari mata kuliah
            </label>
            <div className="flex h-11 items-center gap-2.5 rounded-lg border border-neutral-300 px-3.5 transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/10">
              <Search size={18} strokeWidth={1.75} className="shrink-0 text-neutral-400" aria-hidden="true"/>
              <input id="subject-search" type="search" placeholder="Contoh: Kalkulus, Pemrograman…" className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-neutral-400"/>
            </div>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Populer</span>

          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((subject) => {
            const active = selected.includes(subject);
            return (<button key={subject} type="button" onClick={() => toggle(subject)} aria-pressed={active} className={`flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-[13px] font-medium transition duration-150 active:scale-[0.98] ${active
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"}`}>
                  {active && <Check size={14} strokeWidth={2} aria-hidden="true"/>}
                  {subject}
                </button>);
        })}
          </div>

          <div className="rounded-lg bg-neutral-50 px-3.5 py-2.5 font-mono text-[13px] text-neutral-500">
            {selected.length} mata kuliah dipilih • maksimal {MAX}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/daftar" className="flex h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 text-sm font-semibold text-ink transition duration-150 hover:border-neutral-300 active:scale-[0.98]">
            Kembali
          </Link>
          <Link href="/onboarding-mentor/profil" className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-brand-400 active:scale-[0.98]">
            Lanjut
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true"/>
          </Link>
        </div>
      </div>
    </div>);
}
