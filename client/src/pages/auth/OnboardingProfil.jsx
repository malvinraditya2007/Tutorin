import * as React from "react";
import Link from "@/lib/link";
import { ArrowRight } from "lucide-react";
import { FormField } from "@/components/ui";
const STEPS = [
    { label: "Akun", state: "done" },
    { label: "Mata kuliah", state: "done" },
    { label: "Profil & slot", state: "active" },
];
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const HOURS = ["08–11", "11–14", "14–17", "17–20", "20–22"];
export default function OnboardingProfilPage() {
    const [days, setDays] = React.useState(["Sen", "Rab", "Jum"]);
    const [hours, setHours] = React.useState(["17–20"]);
    const toggle = (value, setFn) => setFn((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
    return (<div className="flex flex-col items-center">
      <div className="flex w-[560px] max-w-full flex-col gap-[22px] px-4 pb-14 pt-10">
        {/* Stepper */}
        <div className="flex gap-2.5">
          {STEPS.map((step, i) => (<div key={step.label} className="flex flex-1 flex-col gap-2">
              <span className="h-1 rounded-full bg-brand-500"/>
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
          Langkah 3 dari 3
        </span>

        {/* Heading */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Siapkan profil &amp; slot
          </h1>
          <p className="max-w-prose text-sm leading-relaxed text-neutral-600">
            Ceritakan singkat tentangmu dan atur waktu mengajar pertamamu.
          </p>
        </div>

        {/* Form card */}
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-6">
          {/* Tentang kamu */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="about" className="text-xs font-medium text-neutral-700">
              Tentang kamu
            </label>
            <textarea id="about" rows={3} placeholder="Ceritakan pengalaman & gaya mengajarmu secara singkat…" className="h-24 resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"/>
          </div>

          {/* Row: tarif + pengalaman */}
          <div className="flex gap-4">
            <div className="flex-1">
              <FormField label="Tarif per jam" placeholder="Rp50.000"/>
            </div>
            <div className="flex-1">
              <FormField label="Pengalaman mengajar" placeholder="Contoh: 2 tahun"/>
            </div>
          </div>

          {/* Hari mengajar */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Hari mengajar</span>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
            const active = days.includes(day);
            return (<button key={day} type="button" onClick={() => toggle(day, setDays)} aria-pressed={active} className={`flex h-9 items-center rounded-lg border px-3.5 text-[13px] font-medium transition duration-150 active:scale-[0.98] ${active
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"}`}>
                    {day}
                  </button>);
        })}
            </div>
          </div>

          {/* Jam tersedia */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Jam tersedia</span>
            <div className="flex flex-wrap gap-2">
              {HOURS.map((hour) => {
            const active = hours.includes(hour);
            return (<button key={hour} type="button" onClick={() => toggle(hour, setHours)} aria-pressed={active} className={`flex h-9 items-center rounded-lg border px-3.5 font-mono text-[13px] font-medium transition duration-150 active:scale-[0.98] ${active
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"}`}>
                    {hour}
                  </button>);
        })}
            </div>
          </div>

          {/* Link Discord */}
          <div className="flex flex-col gap-2">
            <FormField label="Link Discord untuk sesi (wajib diisi)" placeholder="https://discord.gg/..." helperText="Dipakai di semua sesi mentoring. Cukup diisi sekali."/>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/onboarding-mentor/mata-kuliah" className="flex h-11 items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 text-sm font-semibold text-ink transition duration-150 hover:border-neutral-300 active:scale-[0.98]">
            Kembali
          </Link>
          <Link href="/mentor/dashboard" className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-accent-600 active:scale-[0.98]">
            Selesai &amp; masuk dashboard
            <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true"/>
          </Link>
        </div>
      </div>
    </div>);
}
