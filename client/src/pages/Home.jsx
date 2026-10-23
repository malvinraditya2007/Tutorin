import Link from "@/lib/link";
import { ArrowRight, MessageSquare, CalendarCheck, ShieldCheck, } from "lucide-react";
import { Eyebrow, FaqItem, ProofItem, FooterFull, } from "@/components/ui";

const SUBJECTS = [
    {
        title: "Kalkulus & Aljabar",
        subtitle: "186 tutor • mulai Rp45rb",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
    },
    {
        title: "Statistika",
        subtitle: "142 tutor • mulai Rp40rb",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    },
    {
        title: "Pemrograman",
        subtitle: "214 tutor • mulai Rp55rb",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600",
    },
    {
        title: "Akuntansi",
        subtitle: "128 tutor • mulai Rp45rb",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
    },
    {
        title: "Fisika Dasar",
        subtitle: "96 tutor • mulai Rp40rb",
        image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600",
    },
    {
        title: "Bahasa Inggris",
        subtitle: "104 tutor • mulai Rp35rb",
        image: "https://images.unsplash.com/photo-1705573383706-b8b1e5db637a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFoYXNhJTIwaW5nZ3Jpc3xlbnwwfHwwfHx8Mg%3D%3D",
    },
];
const FAQS = [
    { q: "Gimana cara tahu tutornya beneran jago?", a: "Semua tutor dicek transkrip nilainya (minimal A/AB di matkul tersebut). Kamu juga bisa lihat rating dari mahasiswa lain.", open: true },
    { q: "Habis pilih jam dan bayar, terus ngapain?", a: "Link Discord kelas langsung kebuka di menu Jadwal & Sesi. Tinggal masuk pas jamnya mulai." },
    { q: "Uang pembayaranku aman gak?", a: "Aman. Uang ditahan sistem dulu dan baru masuk ke tutor setelah kelas selesai." },
    { q: "Belajarnya online atau ketemuan?", a: "Bisa online lewat Discord (share screen & coret-coret) atau ketemuan langsung kalau satu kampus." },
    { q: "Kalau tutor batalin kelas gimana?", a: "Uangmu otomatis balik 100% tanpa potongan." },
    { q: "Bisa minta bahas PR atau kisi-kisi ujian?", a: "Bisa banget. Tulis aja materi atau soal yang mau dibahas pas booking." },
];
export default function HomePage() {
    return (<>
      {/* Hero */}
      <section className="flex items-stretch gap-14 px-20 pb-16 pt-14">
        <div className="flex w-[640px] flex-col justify-center gap-6">
          <Eyebrow>1.240+ tutor siap bantu minggu ini</Eyebrow>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 lg:text-5xl xl:text-6xl">
            Paham kuliah, bareng teman yang sudah lebih dulu jago.
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-neutral-600">
            Cari kakak tingkat yang udah lulus matkul yang sama, pilih jam
            kosongnya, langsung belajar privat 1-on-1.
          </p>
          <div>
            <Link href="/daftar" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-brand-600 active:scale-[0.98]">
              Cari Tutor
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true"/>
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Populer</span>
            {["Kalkulus", "Statistika", "Akuntansi", "Pemrograman"].map((t) => (<Link key={t} href="/cari-tutor" className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:border-brand-300 hover:text-brand-700">
                {t}
              </Link>))}
          </div>
        </div>
        <div className="relative max-h-[480px] flex-1 overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1759984782199-a4f6d1b6054e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Mahasiswa belajar bersama tutor" className="block size-full object-cover"/>
        </div>
      </section>

      {/* 3 Poin Keunggulan */}
      <section className="border-y border-neutral-200/80 bg-surface">
        <div className="mx-auto grid max-w-[1360px] grid-cols-3 divide-x divide-neutral-200/80 px-20">
          <div className="flex items-start gap-4 py-8 pr-10">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-brand-700 shadow-2xs">
              <MessageSquare size={19} strokeWidth={1.8} aria-hidden="true"/>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-neutral-900">
                Penjelasan gampang nyambung
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">
                Belajar sama kakak tingkat yang paham silabus dan tipe soal kampusmu.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-10 py-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-brand-700 shadow-2xs">
              <CalendarCheck size={19} strokeWidth={1.8} aria-hidden="true"/>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-neutral-900">
                Langsung pilih jam kosong
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">
                Klik jadwal yang cocok, tulis topik bahasan, langsung beres.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 py-8 pl-10">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-brand-700 shadow-2xs">
              <ShieldCheck size={19} strokeWidth={1.8} aria-hidden="true"/>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-neutral-900">
                Dana aman di Escrow
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">
                Uang baru diterusin ke tutor habis sesi kelar. Batal = uang balik penuh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery — mata kuliah */}
      <section className="flex flex-col gap-10 px-20 py-20">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-3">
            <Eyebrow>Pilih topikmu</Eyebrow>
            <h2 className="max-w-xl text-2xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-3xl">
              Mata kuliah yang paling sering bikin begadang.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600">
              Dari materi dasar sampai latihan soal ujian, bareng tutor yang udah lulus kelasnya.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {SUBJECTS.map((s) => (<div key={s.title} className="flex flex-col overflow-hidden rounded-xl border border-neutral-200/80 bg-white">
              <div className="aspect-[16/6] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="size-full object-cover"/>
              </div>
              <div className="flex items-center gap-3 p-4">
                <span className="h-9 w-1 shrink-0 rounded-full bg-brand-500" aria-hidden="true"/>
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold tracking-tight text-neutral-900">
                    {s.title}
                  </span>
                  <span className="text-xs text-neutral-500">{s.subtitle}</span>
                </div>
              </div>
            </div>))}
        </div>
      </section>

      {/* Peer advantage */}
      <section className="flex items-stretch bg-sidebar">
        <div className="w-[560px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1588873281272-14886ba1f737?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Sesi belajar kelompok" className="size-full object-cover"/>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-7 px-16 py-16">
          <h2 className="max-w-xl text-3xl font-semibold leading-snug tracking-tight text-white">
            Bukan sekadar pintar. Mereka ngerti rasanya jadi kamu.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            Belajar bareng teman kampus yang tahu silabus dan gaya soal dosen
            bikin materi rumit jauh lebih cepat masuk akal.
          </p>
          <div className="flex gap-12 border-t border-white/10 pt-7">
            <ProofItem value="3,7+" label="IPK minimum tutor"/>
            <ProofItem value="2 tahap" label="verifikasi profil"/>
            <ProofItem value="1-on-1" label="fokus penuh untukmu"/>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col items-center bg-cream">
        <div className="flex w-[1280px] max-w-full gap-20 px-20 py-20">
          <div className="flex w-[360px] shrink-0 flex-col gap-3">
            <Eyebrow>Tanya dulu</Eyebrow>
            <h2 className="text-2xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-3xl">
              Yang sering ditanyain.
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Hal penting sebelum mulai booking sesi pertamamu.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-3.5">
            {FAQS.map((f) => (<FaqItem key={f.q} question={f.q} answer={f.a} defaultOpen={f.open}/>))}
          </div>
        </div>
      </section>

      <FooterFull />
    </>);
}
