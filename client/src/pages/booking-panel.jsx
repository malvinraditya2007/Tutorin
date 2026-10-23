import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  ShieldCheck,
  Lock,
  CalendarCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/auth/auth";
import { computeFees } from "@/lib/fees";
import { rp } from "@/lib/money";
import { formatDate, formatTime } from "@/lib/datetime";

export function BookingPanel({ mentorId, subjects, pricePerHour, slots }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [slotIdx, setSlotIdx] = React.useState(0);
  const [subjectId, setSubjectId] = React.useState(
    subjects.length > 0 ? subjects[0].id : null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const durationMinutes = 60;
  const mode = "online";
  const selectedSlot = slots[slotIdx];

  const { amount, serviceFee, total } = computeFees(pricePerHour, durationMinutes);

  const slotLabel = (iso) => ({
    day: formatDate(iso, { weekday: "short", day: "numeric", month: "short" }),
    time: formatTime(iso),
  });

  const monthLabel = slots[0]
    ? formatDate(slots[0].startsAt, { month: "long", year: "numeric" })
    : "—";

  const canBook = Boolean(selectedSlot && subjectId && !loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canBook) return;
    setError(null);

    if (!user) {
      navigate(`/login?callbackUrl=${encodeURIComponent(`/tutor/${mentorId}`)}`);
      return;
    }
    if (user.role !== "mahasiswa") {
      setError("Hanya mahasiswa yang dapat membooking tutor.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        mentorId,
        subjectId,
        slotId: selectedSlot.id,
        durationMinutes,
        mode,
      });
      navigate(`/checkout?booking=${res.id}`);
    } catch (err) {
      setError(err.message || "Gagal membuat booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-6 flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold tracking-tight text-neutral-900">Pilih jadwal belajar</h2>
          <span className="font-mono text-lg font-semibold text-neutral-900">
            {rp(pricePerHour)}
            <span className="text-xs font-normal text-neutral-400"> /60 mnt</span>
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-700">
          <span className="size-1.5 rounded-full bg-available" aria-hidden="true" />
          Live
        </span>
      </div>

      {error && (
        <div className="rounded-lg bg-danger-50 p-2.5 text-xs font-medium text-danger-700">
          {error}
        </div>
      )}

      {/* Select Subject */}
      {subjects.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Topik belajar</span>
          <select
            value={subjectId ?? ""}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Month nav */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
        <IconButton><ChevronLeft size={16} strokeWidth={1.75} /></IconButton>
        <span className="text-sm font-medium text-neutral-700">{monthLabel}</span>
        <IconButton><ChevronRight size={16} strokeWidth={1.75} /></IconButton>
      </div>

      {/* Slots */}
      {slots.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Pilih slot kosong</span>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((s, i) => {
              const { day, time } = slotLabel(s.startsAt);
              const active = slotIdx === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlotIdx(i)}
                  className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition duration-150 active:scale-[0.98] ${
                    active
                      ? "border-brand-700 bg-brand-700 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-brand-600"
                  }`}
                >
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">{day}</span>
                  <span className="font-mono text-sm font-semibold">{time}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-lg bg-neutral-50 px-3.5 py-3 text-[13px] text-neutral-500">
          Belum ada slot kosong. Coba cek lagi nanti.
        </p>
      )}

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Durasi sesi</span>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-brand-600 bg-brand-50 py-2 text-sm font-medium text-brand-700">
            60 Menit
          </div>
        </div>
      </div>

      {/* Format */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Format sesi</span>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center justify-center gap-2 rounded-lg border border-brand-600 bg-brand-50 py-2 text-sm font-medium text-brand-700">
            <Video size={16} strokeWidth={1.75} aria-hidden="true" />
            Online
          </div>
        </div>
      </div>

      {/* Selected summary */}
      {selectedSlot && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-500/20 bg-accent-50 px-3 py-2.5 text-[13px] font-medium text-accent-600">
          <CalendarCheck size={16} strokeWidth={1.75} aria-hidden="true" />
          {new Date(selectedSlot.startsAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          {" • "}
          {new Date(selectedSlot.startsAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
        </div>
      )}

      {/* Price breakdown — receipt mono */}
      <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 text-sm">
        <div className="flex justify-between text-neutral-500">
          <span>Tarif tutor • {durationMinutes} mnt</span>
          <span className="font-mono">{rp(amount)}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Biaya layanan (8%)</span>
          <span className="font-mono">{rp(serviceFee)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
          <span className="font-semibold text-neutral-900">Estimasi total</span>
          <span className="font-mono text-lg font-semibold text-neutral-900">{rp(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canBook}
        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-accent-500 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-accent-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Memproses..." : "Kunci jadwal"}
        <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2.5 rounded-lg bg-brand-50 p-3">
        <ShieldCheck size={18} strokeWidth={1.75} className="shrink-0 text-brand-700" aria-hidden="true" />
        <p className="text-[11px] leading-normal text-brand-700">
          Pembayaran aman dengan escrow. Dana ditahan dan otomatis diteruskan setelah sesi berakhir.
        </p>
      </div>
    </form>
  );
}

function IconButton({ children }) {
  return (
    <span className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
      {children}
    </span>
  );
}
