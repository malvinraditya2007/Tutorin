import * as React from "react";
import { Plus, Trash2, Info, Lock, Calendar as CalendarIcon, Check } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/datetime";

const dayFmt = (iso) =>
  formatDate(iso, { weekday: "long", day: "numeric", month: "long" });
const timeFmt = formatTime;

export function KalenderView({ slots = [], onReload }) {
  const [selectedDate, setSelectedDate] = React.useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [customTime, setCustomTime] = React.useState("");
  const [error, setError] = React.useState(null);
  const [pending, setPending] = React.useState(false);

  // Kelompokkan slot per tanggal untuk list view di bawah
  const groups = React.useMemo(() => {
    const map = new Map();
    for (const s of slots) {
      const key = dayFmt(s.startsAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    }
    return Array.from(map.entries()).sort((a, b) => {
      const dateA = new Date(a[1][0].startsAt).getTime();
      const dateB = new Date(b[1][0].startsAt).getTime();
      return dateA - dateB;
    });
  }, [slots]);

  const openCount = slots.filter((s) => s.state === "open").length;

  async function handleAddCustom() {
    setError(null);
    if (!customTime) {
      setError("Pilih tanggal & waktu dulu.");
      return;
    }
    setPending(true);
    try {
      await api.post("/mentor/slots", { startsAt: new Date(customTime).toISOString() });
      setCustomTime("");
      if (onReload) onReload();
    } catch (err) {
      setError(err?.message || "Gagal menambahkan slot.");
    } finally {
      setPending(false);
    }
  }

  async function handleRemove(id) {
    setError(null);
    setPending(true);
    try {
      await api.delete(`/mentor/slots/${id}`);
      if (onReload) onReload();
    } catch (err) {
      setError(err?.message || "Gagal menghapus slot.");
    } finally {
      setPending(false);
    }
  }

  async function handleToggleSlot(dateTimeLocal, existingSlot) {
    setError(null);
    setPending(true);
    try {
      if (existingSlot) {
        if (existingSlot.state === "booked") return;
        await api.delete(`/mentor/slots/${existingSlot.id}`);
      } else {
        await api.post("/mentor/slots", { startsAt: new Date(dateTimeLocal).toISOString() });
      }
      if (onReload) onReload();
    } catch (err) {
      setError(err?.message || "Gagal mengubah slot.");
    } finally {
      setPending(false);
    }
  }

  // Generate quick times for the selected date (07:00 to 22:00)
  const quickTimes = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    const timeString = `${String(hour).padStart(2, "0")}:00`;
    const dateTimeLocal = `${selectedDate}T${timeString}`;

    const existingSlot = slots.find((s) => {
      const d = new Date(s.startsAt);
      const sYear = d.getFullYear();
      const sMonth = String(d.getMonth() + 1).padStart(2, "0");
      const sDay = String(d.getDate()).padStart(2, "0");
      const sHour = String(d.getHours()).padStart(2, "0");
      const sMin = String(d.getMinutes()).padStart(2, "0");
      const sLocal = `${sYear}-${sMonth}-${sDay}T${sHour}:${sMin}`;
      return sLocal === dateTimeLocal;
    });

    return { timeString, dateTimeLocal, existingSlot };
  });

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-7 px-8 py-6">
      {/* Pilihan Cepat */}
      <div className="flex flex-col gap-5 rounded-2xl border border-neutral-200/80 bg-white p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-bold tracking-tight text-neutral-900">Tambah Slot Cepat</h2>
          <p className="text-xs text-neutral-500">Pilih tanggal dan klik waktu untuk membuka atau menutup slot (durasi 60 menit).</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {/* Date Picker */}
          <div className="flex flex-col gap-2 shrink-0">
            <label className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Pilih Tanggal</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-11 w-full sm:w-44 rounded-lg border border-neutral-300 bg-white px-3.5 text-sm text-ink outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
              />
            </div>
          </div>

          {/* Time Grid */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Pilih Waktu</label>
              <span className="text-xs text-neutral-500">
                Slot terbuka: <span className="font-mono font-semibold text-brand-700">{openCount}</span> total
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickTimes.map(({ timeString, dateTimeLocal, existingSlot }) => {
                const isBooked = existingSlot?.state === "booked";
                const isOpen = existingSlot?.state === "open";

                let buttonStyle = "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700";
                if (isOpen) {
                  buttonStyle = "border-brand-500 bg-brand-500 text-white shadow-sm hover:bg-danger-500 hover:border-danger-500";
                } else if (isBooked) {
                  buttonStyle = "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed";
                }

                return (
                  <button
                    key={timeString}
                    type="button"
                    disabled={pending || isBooked}
                    onClick={() => handleToggleSlot(dateTimeLocal, existingSlot)}
                    className={`group relative flex h-10 items-center justify-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-all duration-200 active:scale-95 disabled:active:scale-100 ${buttonStyle}`}
                  >
                    {isOpen && <Check size={14} strokeWidth={2.5} className="group-hover:hidden" />}
                    {isOpen && <Trash2 size={14} strokeWidth={2.5} className="hidden group-hover:block" />}
                    {isBooked && <Lock size={12} strokeWidth={2} />}
                    {timeString}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Input */}
        <div className="mt-4 flex items-end gap-3 border-t border-neutral-100 pt-5">
          <label className="flex flex-col gap-1.5 flex-1 max-w-sm">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">Waktu Kustom</span>
            <input
              type="datetime-local"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="h-11 rounded-lg border border-neutral-300 bg-white px-3.5 text-sm text-ink outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
            />
          </label>
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={pending || !customTime}
            className="flex h-11 items-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
          >
            <Plus size={18} strokeWidth={1.75} aria-hidden="true" />
            Tambah Kustom
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger-500/30 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600">
          {error}
        </div>
      )}

      {/* Daftar Slot Aktif */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold tracking-tight text-neutral-900">Daftar Slot Mendatang</h3>
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-16 text-center">
            <span className="text-sm font-semibold text-neutral-900">Belum ada slot</span>
            <span className="text-xs text-neutral-500">Tambahkan slot agar mahasiswa bisa booking.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(([day, items]) => (
              <div key={day} className="flex flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <CalendarIcon size={16} className="text-brand-600" />
                  <span className="text-sm font-semibold tracking-tight text-neutral-900">{day}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => {
                    const booked = s.state === "booked";
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-medium ${
                          booked
                            ? "border-neutral-200 bg-neutral-100 text-neutral-500"
                            : "border-brand-200 bg-brand-50 text-brand-700"
                        }`}
                      >
                        <span>{timeFmt(s.startsAt)}–{timeFmt(s.endsAt)}</span>
                        {booked ? (
                          <Lock size={14} strokeWidth={1.75} aria-label="Dipesan" />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemove(s.id)}
                            disabled={pending}
                            aria-label="Hapus slot"
                            className="text-brand-600 transition-colors hover:text-danger-600 disabled:opacity-50"
                          >
                            <Trash2 size={14} strokeWidth={1.75} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-500">
          <Info size={18} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="text-xs leading-normal text-neutral-600">
          Slot bertanda gembok sudah dibayar mahasiswa dan tidak bisa dihapus.
          Durasi default tiap slot 60 menit, zona waktu mengikuti perangkatmu.
        </span>
      </div>
    </div>
  );
}
