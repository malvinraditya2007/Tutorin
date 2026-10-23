import * as React from "react";
import { useSearchParams } from "react-router-dom";
import Link from "@/lib/link";
import {
  ArrowLeft,
  Check,
  BadgeCheck,
  CalendarDays,
  Search,
  CalendarCheck,
  Clock,
  Video,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/datetime";
import { rp } from "@/lib/money";

const NEXT_STEPS = [
  { icon: <Bell className="size-[18px]" />, title: "Pengingat otomatis", desc: "Kami kirim notifikasi sebelum sesi dimulai." },
  { icon: <MessageCircle className="size-[18px]" />, title: "Siapkan materi", desc: "Kirim topik atau soal ke tutor sebelum sesi." },
  { icon: <Video className="size-[18px]" />, title: "Gabung via Discord", desc: "Link sesi aktif otomatis saat waktunya tiba." },
];

const dateFmt = (d) =>
  formatDate(d, { weekday: "long", day: "numeric", month: "short", year: "numeric" });
const timeFmt = formatTime;

export default function KonfirmasiPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking");

  const [booking, setBooking] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!bookingId) return;
    let active = true;
    api.get(`/bookings/${bookingId}`)
      .then((data) => {
        if (active) setBooking(data.booking);
      })
      .catch((err) => {
        console.error("Failed to load booking confirmation:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-neutral-500">
        Memuat konfirmasi booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-neutral-600">Booking tidak ditemukan.</p>
        <Link href="/mahasiswa/dashboard" className="text-sm font-semibold text-brand-600 hover:underline">
          Lihat jadwal saya
        </Link>
      </div>
    );
  }

  const firstName = booking.mentorName.split(" ")[0];

  return (
    <>
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200/70 px-14">
        <Logo />
        <span className="flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-700">
          <Check size={13} strokeWidth={2.5} aria-hidden="true" />
          Booking selesai
        </span>
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          Beranda
        </Link>
      </header>

      <div className="flex flex-col items-center gap-6 px-20 pb-14 pt-12">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand-600 text-white">
          <Check size={32} strokeWidth={2} aria-hidden="true" />
        </span>

        <div className="flex w-[640px] max-w-full flex-col items-center gap-2.5 text-center">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-brand-700">
            <BadgeCheck size={14} strokeWidth={1.75} aria-hidden="true" />
            Pembayaran berhasil
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">Jadwalmu sudah terkunci!</h1>
          <p className="max-w-prose text-base leading-relaxed text-neutral-600">
            Booking bersama {firstName} berhasil. Detail sesi sudah masuk ke
            jadwal kamu dan tutor.
          </p>
        </div>

        <div className="flex gap-5">
          <div className="flex w-[600px] shrink-0 flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold tracking-tight text-neutral-900">Rincian booking</span>
              <span className="font-mono text-xs text-neutral-400">#{booking.reference}</span>
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="flex items-center gap-4">
              <img src={booking.mentorPhoto} alt={booking.mentorName} className="size-14 rounded-lg object-cover" />
              <div className="flex flex-1 flex-col">
                <span className="font-semibold text-neutral-900">{booking.mentorName}</span>
                <span className="text-sm text-neutral-500">
                  {booking.subjectName}
                  {booking.topic ? ` — ${booking.topic}` : ""}
                </span>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="flex items-center gap-2 text-sm text-neutral-700">
                <CalendarCheck size={16} strokeWidth={1.75} className="text-brand-600" aria-hidden="true" />
                {dateFmt(booking.startsAt)}
              </span>
              <span className="flex items-center gap-2 text-sm text-neutral-700">
                <Clock size={16} strokeWidth={1.75} className="text-brand-600" aria-hidden="true" />
                {timeFmt(booking.startsAt)}–{timeFmt(booking.endsAt)} WIB
              </span>
              <span className="flex items-center gap-2 text-sm text-neutral-700">
                {booking.mode === "online" ? (
                  <Video size={16} strokeWidth={1.75} className="text-brand-600" aria-hidden="true" />
                ) : (
                  <MapPin size={16} strokeWidth={1.75} className="text-brand-600" aria-hidden="true" />
                )}
                {booking.mode === "online" ? "Online" : "Tatap muka"}
              </span>
            </div>
            <div className="h-px bg-neutral-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Total dibayar</span>
              <span className="font-mono text-lg font-semibold text-neutral-900">{rp(booking.total)}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 p-3.5">
              <ShieldCheck size={20} strokeWidth={1.75} className="shrink-0 text-brand-700" aria-hidden="true" />
              <span className="text-xs leading-normal text-brand-700">
                Dana ditahan escrow dan diteruskan ke tutor setelah sesi selesai.
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-base font-semibold tracking-tight text-neutral-900">Langkah berikutnya</h2>
            {NEXT_STEPS.map((s) => (
              <div key={s.title} className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  {s.icon}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-neutral-900">{s.title}</span>
                  <span className="text-xs text-neutral-500">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/mahasiswa/dashboard"
            className="flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-brand-400 active:scale-[0.98]"
          >
            Lihat jadwal saya
            <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <Link
            href="/cari-tutor"
            className="flex h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 text-sm font-semibold text-ink transition duration-150 hover:border-neutral-300 active:scale-[0.98]"
          >
            Kembali mencari tutor
            <Search size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
