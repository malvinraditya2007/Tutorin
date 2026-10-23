import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Link from "@/lib/link";
import {
  ArrowLeft,
  Timer,
  CalendarCheck,
  Clock,
  Video,
  MapPin,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/datetime";
import { PaymentForm } from "./PaymentForm";

const dateFmt = (d) =>
  formatDate(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const timeFmt = formatTime;

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("booking");

  const [booking, setBooking] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!bookingId) {
      navigate("/cari-tutor", { replace: true });
      return;
    }
    let active = true;
    setLoading(true);
    api.get(`/bookings/${bookingId}`)
      .then((data) => {
        if (!active) return;
        if (data.booking.status !== "menunggu_pembayaran") {
          navigate(`/konfirmasi?booking=${data.booking.id}`, { replace: true });
        } else {
          setBooking(data.booking);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Booking tidak ditemukan.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [bookingId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-medium text-neutral-500">
        Memuat detail checkout...
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <p className="text-sm text-neutral-600">{error || "Booking tidak ditemukan."}</p>
        <Link href="/cari-tutor" className="text-sm font-semibold text-brand-600 hover:underline">
          Kembali ke cari tutor
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200/70 px-14">
        <Logo />
        <StepIndicator current={2} />
        <Link href="/cari-tutor" className="flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
          <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
          Kembali
        </Link>
      </header>

      <div className="flex flex-col gap-6 px-20 pb-12 pt-8">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-700">Satu langkah lagi</span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Tinjau dan bayar bookingmu</h1>
            <p className="text-sm text-neutral-600">
              Pastikan jadwal, format, dan metode pembayaran sudah sesuai.
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            <Timer size={14} strokeWidth={1.75} aria-hidden="true" />
            Slot ditahan
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-5">
              <div className="flex items-center gap-4">
                <img src={booking.mentorPhoto} alt={booking.mentorName} className="size-14 rounded-lg object-cover" />
                <div className="flex flex-col">
                  <span className="text-base font-semibold tracking-tight text-neutral-900">{booking.mentorName}</span>
                  <span className="text-sm text-neutral-500">
                    {booking.subjectName}
                    {booking.topic ? ` — ${booking.topic}` : ""}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
                <SummaryRow icon={<CalendarCheck size={16} strokeWidth={1.75} />} label="Jadwal" value={dateFmt(booking.startsAt)} />
                <SummaryRow icon={<Clock size={16} strokeWidth={1.75} />} label="Waktu" value={`${timeFmt(booking.startsAt)}–${timeFmt(booking.endsAt)} WIB (${booking.durationMinutes} mnt)`} />
                <SummaryRow
                  icon={booking.mode === "online" ? <Video size={16} strokeWidth={1.75} /> : <MapPin size={16} strokeWidth={1.75} />}
                  label="Format"
                  value={booking.mode === "online" ? "Online via Discord" : "Tatap muka"}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4">
              <ShieldCheck size={20} strokeWidth={1.75} className="shrink-0 text-brand-700" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-neutral-900">Pembayaran dilindungi escrow</span>
                <span className="text-xs leading-normal text-neutral-600">
                  Dana ditahan sistem dan baru diteruskan ke tutor setelah sesi
                  selesai. Jika tutor membatalkan, kamu mendapat refund penuh.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3.5">
              <Check size={18} strokeWidth={1.75} className="shrink-0 text-brand-600" aria-hidden="true" />
              <span className="text-xs text-neutral-600">
                Link Discord akan dibagikan otomatis setelah pembayaran berhasil.
              </span>
            </div>
          </div>

          <div className="col-span-5">
            <PaymentForm
              bookingId={booking.id}
              amount={booking.amount}
              serviceFee={booking.serviceFee}
              total={booking.total}
              durationMinutes={booking.durationMinutes}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function StepIndicator({ current }) {
  const steps = ["Pilih", "Bayar", "Selesai"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={label}>
            <span className="flex items-center gap-1.5">
              <span
                className={`flex size-5 items-center justify-center rounded-full font-mono text-[10px] font-semibold ${
                  done
                    ? "bg-brand-600 text-white"
                    : active
                      ? "bg-accent-500 text-white"
                      : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {done ? <Check size={11} strokeWidth={2.5} /> : n}
              </span>
              <span className={`text-xs font-medium ${active ? "text-neutral-900" : "text-neutral-400"}`}>{label}</span>
            </span>
            {n < steps.length && <span className="h-px w-5 bg-neutral-200" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-neutral-500">
        <span className="text-brand-600">{icon}</span>
        {label}
      </span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}
