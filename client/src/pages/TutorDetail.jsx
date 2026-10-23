import * as React from "react";
import { useParams } from "react-router-dom";
import Link from "@/lib/link";
import {
  ArrowLeft,
  BadgeCheck,
  GraduationCap,
  Star,
  CalendarCheck,
  MessageCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Badge, Footer } from "@/components/ui";
import { api } from "@/lib/api";
import { BookingPanel } from "./booking-panel";

const ratingFmt = (n) =>
  Number(n).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function ProfilTutorPage() {
  const { id } = useParams();
  const [tutor, setTutor] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/tutors/${id}`)
      .then((data) => {
        if (active) setTutor(data.tutor);
      })
      .catch((err) => {
        if (active) setError(err.message || "Tutor tidak ditemukan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-neutral-500">Memuat profil tutor...</div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-neutral-600">{error || "Tutor tidak ditemukan."}</p>
        <Link href="/cari-tutor" className="text-sm font-semibold text-brand-600 hover:underline">
          Kembali ke cari tutor
        </Link>
      </div>
    );
  }

  const firstName = tutor.name.split(" ")[0];

  return (
    <>
      <section className="flex flex-col gap-6 px-20 pb-16 pt-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px]">
          <Link href="/cari-tutor" className="flex items-center gap-1.5 font-medium text-brand-700 hover:underline">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
            Kembali ke hasil pencarian
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-500">Profil {tutor.name}</span>
        </div>

        {/* Two-column: narrative (8) + sticky booking (4) */}
        <div className="grid grid-cols-12 gap-7">
          {/* Left: profile */}
          <div className="col-span-8 flex flex-col gap-5">
            {/* Profile card */}
            <div className="flex gap-6 rounded-xl border border-neutral-200/80 bg-white p-6">
              <div className="relative aspect-[3/4] w-[260px] shrink-0 overflow-hidden rounded-lg">
                <img src={tutor.photoUrl} alt={tutor.name} className="size-full object-cover" />
                {tutor.isVerified && (
                  <Badge type="verified" className="absolute left-3 top-3 shadow-sm">
                    Terverifikasi
                  </Badge>
                )}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-white/95 px-2 py-1 font-mono text-[10px] font-semibold text-available shadow-sm backdrop-blur-sm">
                  <span className="size-1.5 rounded-full bg-available" aria-hidden="true" />
                  Bisa booking minggu ini
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4">
                <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-neutral-900">
                  {tutor.name}
                  {tutor.isVerified && (
                    <BadgeCheck size={24} strokeWidth={1.75} className="text-brand-600" aria-hidden="true" />
                  )}
                </h1>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                    <GraduationCap size={18} strokeWidth={1.75} aria-hidden="true" />
                    {tutor.university}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {tutor.studyProgram}
                    {tutor.semester ? ` • Semester ${tutor.semester}` : ""}
                  </span>
                </div>
                {tutor.headline && (
                  <p className="rounded-lg border border-brand-100 bg-brand-50 p-3.5 text-sm font-medium text-brand-700">
                    “{tutor.headline}”
                  </p>
                )}
                <div className="flex gap-6 border-t border-neutral-100 pt-4">
                  <Stat icon={<Star size={16} strokeWidth={1.75} className="fill-star text-star" />} value={`${ratingFmt(tutor.rating)}/5`} label={`${tutor.reviewCount} ulasan`} />
                  <Stat icon={<CalendarCheck size={16} strokeWidth={1.75} className="text-brand-600" />} value={`${tutor.sessionsCompleted} sesi`} label="selesai" />
                  <Stat icon={<MessageCircle size={16} strokeWidth={1.75} className="text-brand-600" />} value="± 8 mnt" label="respons" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-md border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-xs text-neutral-700"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* About card */}
            {tutor.bio && (
              <div className="flex flex-col gap-5 rounded-xl border border-neutral-200/80 bg-white p-6">
                <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Tentang {firstName}</h2>
                <p className="max-w-prose text-sm leading-relaxed text-neutral-600">{tutor.bio}</p>
                <div className="flex gap-6 border-t border-neutral-100 pt-5">
                  <Stat icon={<ShieldCheck size={16} strokeWidth={1.75} className="text-brand-600" />} value="Terverifikasi" label="nilai & identitas" />
                  <Stat icon={<Check size={16} strokeWidth={1.75} className="text-brand-600" />} value="98% hadir" label="sesi terjadwal" />
                  <Stat icon={<MessageCircle size={16} strokeWidth={1.75} className="text-brand-600" />} value="Balas cepat" label="rata-rata 8 mnt" />
                </div>
              </div>
            )}

            {/* Reviews */}
            {tutor.reviews.length > 0 && (
              <div className="flex flex-col gap-5 rounded-xl border border-neutral-200/80 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Ulasan mahasiswa</h2>
                  <span className="flex items-center gap-1.5 font-mono text-sm text-neutral-700">
                    <Star size={14} strokeWidth={1.75} className="fill-star text-star" aria-hidden="true" />
                    <span className="font-semibold">{ratingFmt(tutor.rating)}</span>
                    <span className="text-neutral-400">/ {tutor.reviewCount} ulasan</span>
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-neutral-100">
                  {tutor.reviews.map((r) => (
                    <div key={r.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-900">{r.name}</span>
                          <span className="inline-flex items-center gap-1 rounded border border-brand-100 bg-brand-50 px-1.5 py-0.5 font-mono text-[10px] text-brand-700">
                            <BadgeCheck size={11} strokeWidth={2} /> Terverifikasi
                          </span>
                        </div>
                        <span className="flex text-star" aria-label={`${r.rating} bintang`}>
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={13} strokeWidth={1.75} className="fill-star" aria-hidden="true" />
                          ))}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-neutral-600">“{r.text}”</p>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">{r.subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: sticky booking widget */}
          <div className="col-span-4">
            <BookingPanel
              mentorId={tutor.id}
              subjects={tutor.subjects}
              pricePerHour={tutor.pricePerHour}
              slots={tutor.slots}
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-50">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="font-mono text-sm font-semibold text-neutral-900">{value}</span>
        <span className="text-[11px] text-neutral-500">{label}</span>
      </span>
    </div>
  );
}
