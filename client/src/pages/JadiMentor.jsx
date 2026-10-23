import Link from "@/lib/link";
import { Wallet, CalendarClock, GraduationCap, ArrowRight, } from "lucide-react";
import { Eyebrow, Button, FaqItem, FooterFull } from "@/components/ui";

const STEPS = [
    {
        n: 1,
        title: "Daftar akun",
        desc: "Buat akun dan pilih peran sebagai mentor.",
    },
    {
        n: 2,
        title: "Pilih matkul",
        desc: "Centang mata kuliah yang udah kamu kuasai.",
    },
    {
        n: 3,
        title: "Pasang tarif",
        desc: "Tentukan harga per jam dan buka jam kosongmu.",
    },
    {
        n: 4,
        title: "Mulai ngajar",
        desc: "Terima booking dan tarik penghasilan ke bank.",
    },
];
const FAQS = [
    {
        q: "Syarat daftarnya apa aja?",
        a: "Mahasiswa aktif dengan IPK minimal 3,7 atau udah lulus matkul terkait dengan nilai A/AB.",
        open: true,
    },
    {
        q: "Kapan bayaran ngajar masuk ke saldo?",
        a: "Begitu kelas selesai, uang langsung masuk ke dompetmu dan siap ditarik ke rekening.",
    },
    {
        q: "Ada target jam wajib tiap minggu?",
        a: "Enggak ada. Lagi sibuk ujian atau praktikum? Tinggal tutup jadwalmu.",
    },
    {
        q: "Matkul apa aja yang bisa diajar?",
        a: "Kalkulus, Statistika, Pemrograman, Struktur Data, Akuntansi, Fisika Dasar, Aljabar Linear, sampai Bahasa Inggris.",
    },
];
export default function JadiMentorPage() {
    return (<>
      {/* Hero */}
      <section className="flex items-center gap-14 px-20 pb-16 pt-14">
        <div className="flex w-[600px] flex-col gap-6">
          <Eyebrow>Jadi mentor Tutorin</Eyebrow>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-neutral-900 lg:text-5xl">
            Ubah nilai bagusmu jadi uang jajan tambahan.
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-neutral-600">
            Bantu adik tingkat paham matkul yang udah kamu kuasai. Jadwal dan
            tarifnya kamu yang atur sendiri.
          </p>
          <div className="flex gap-3">
            <Link href="/daftar">
              <Button variant="primary" rightIcon={<ArrowRight size={18} strokeWidth={1.75}/>}>
                Daftar jadi mentor
              </Button>
            </Link>
          </div>
        </div>
        <div className="h-[460px] flex-1 overflow-hidden rounded-xl border border-neutral-200/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHV0b3IlMjBvbmxpbmV8ZW58MHx8MHx8fDI%3D" alt="Mentor mengajar" className="size-full object-cover"/>
        </div>
      </section>

      {/* 3 Keunggulan Mentor */}
      <section className="border-y border-neutral-200/80 bg-surface">
        <div className="mx-auto grid max-w-[1360px] grid-cols-3 divide-x divide-neutral-200/80 px-20">
          <div className="flex items-start gap-4 py-8 pr-10">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-brand-700 shadow-2xs">
              <Wallet size={19} strokeWidth={1.8} aria-hidden="true"/>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-neutral-900">
                Tarif suka-suka kamu
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">
                Pasang harga per jam sendiri, terima utuh tanpa potongan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 px-10 py-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-brand-700 shadow-2xs">
              <CalendarClock size={19} strokeWidth={1.8} aria-hidden="true"/>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-neutral-900">
                Ngajar pas luang aja
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">
                Gak ada jam wajib. Sibuk kuliah tinggal tutup slot.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 py-8 pl-10">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/70 bg-white text-brand-700 shadow-2xs">
              <GraduationCap size={19} strokeWidth={1.8} aria-hidden="true"/>
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-neutral-900">
                Ajarin yang kamu jago
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">
                Cukup pilih matkul yang pernah kamu lulusin dengan nilai bagus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration journey */}
      <section className="flex flex-col items-center gap-10 px-20 py-20">
        <div className="flex w-[760px] max-w-full flex-col items-center gap-2.5 text-center">
          <Eyebrow>Cara mulai</Eyebrow>
          <h2 className="text-2xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-3xl">
            4 langkah langsung bisa ngajar.
          </h2>
        </div>
        <div className="grid w-full grid-cols-4 gap-4">
          {STEPS.map((s) => (<div key={s.n} className="flex flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                {s.n}
              </span>
              <h3 className="text-sm font-semibold text-neutral-900">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                {s.desc}
              </p>
            </div>))}
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-16 border-t border-neutral-200/70 px-20 py-20">
        <div className="flex gap-20">
          <div className="flex w-[340px] shrink-0 flex-col gap-3">
            <Eyebrow>Tanya jawab</Eyebrow>
            <h2 className="text-2xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-3xl">
              Yang sering ditanyain calon mentor.
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Hal penting sebelum kamu mulai buka jadwal mengajar.
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
