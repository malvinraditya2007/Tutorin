import * as React from "react";
import Link from "@/lib/link";
import {
  MapPin,
  Clock,
  CalendarDays,
  Video,
  CalendarCheck,
  Wallet,
  Star,
  Settings,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { AccountHeader, Badge } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { rp, rpSigned } from "@/lib/money";
import { formatDate, formatTime, formatNotifTime } from "@/lib/datetime";

const dateFmt = (d) =>
  formatDate(d, { weekday: "short", day: "numeric", month: "short" });
const timeFmt = formatTime;
const notifTimeFmt = formatNotifTime;

const NOTIF_META = {
  sesi: { icon: <CalendarCheck size={15} strokeWidth={2} />, tone: "bg-brand-50 text-brand-700" },
  pembayaran: { icon: <Wallet size={15} strokeWidth={2} />, tone: "bg-emerald-50 text-emerald-700" },
  ulasan: { icon: <Star size={15} strokeWidth={2} />, tone: "bg-amber-50 text-amber-700" },
  sistem: { icon: <Settings size={15} strokeWidth={2} />, tone: "bg-neutral-100 text-neutral-600" },
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function DashboardMentorPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    wallet: null,
    entries: [],
    incoming: [],
    accepted: [],
    history: [],
    notifs: [],
  });

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      api.get("/mentor/wallet"),
      api.get("/mentor/requests"),
      api.get("/notifications"),
    ])
      .then(([walletData, reqData, notifData]) => {
        if (!active) return;
        setData({
          wallet: walletData?.wallet ?? null,
          entries: walletData?.entries ?? [],
          incoming: reqData?.incoming ?? [],
          accepted: reqData?.accepted ?? [],
          history: reqData?.history ?? [],
          notifs: notifData?.notifications ?? [],
        });
      })
      .catch((err) => {
        console.error("Failed to load mentor dashboard data:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const { wallet, entries, incoming, accepted, history, notifs } = data;

  const activeSessions = [...incoming, ...accepted].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  const completedHistory = history
    .filter((b) => b.status === "selesai")
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())
    .slice(0, 5);

  const metrics = [
    {
      label: "TOTAL PENDAPATAN",
      value: rp(wallet?.totalEarnings ?? 0),
      caption: "Akumulasi sesi selesai",
      color: "text-neutral-900",
    },
    {
      label: "DITAHAN ESCROW",
      value: rp(wallet?.escrowBalance ?? 0),
      caption: `${activeSessions.length} sesi aktif`,
      color: "text-neutral-900",
    },
    {
      label: "SALDO TERSEDIA",
      value: rp(wallet?.availableBalance ?? 0),
      caption: "Siap dicairkan ke rekening",
      color: "text-neutral-900",
    },
  ];

  return (
    <>
      <AccountHeader
        title={`Halo, ${user?.fullName ? user.fullName.split(" ")[0] : "Mentor"}!`}
        subtitle="Ringkasan jadwal mengajar, dana escrow, dan aktivitas dompetmu."
        userName={user?.fullName || "Mentor"}
        userRole="Mentor"
        avatarUrl={user?.avatarUrl ?? "/avatar-default.svg"}
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-7 px-8 py-6 xl:grid-cols-[1fr_340px]">
        {/* Left Main Column: 3 Stat Cards + Sesi Mengajar Mendatang + Riwayat Sesi Selesai */}
        <div className="flex min-w-0 flex-col gap-7">
          {/* 3 Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  {m.label}
                </span>
                <span className={`text-3xl font-extrabold tracking-tight ${m.color}`}>
                  {m.value}
                </span>
                <span className="text-xs text-neutral-500">{m.caption}</span>
              </div>
            ))}
          </div>

          {/* Section 1: Sesi Mengajar Mendatang */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-bold tracking-tight text-neutral-900">
                  Sesi mengajar mendatang
                </h2>
                <span className="text-xs text-neutral-500">
                  Jadwal kelas yang sudah dibayar mahasiswa dan siap berlangsung
                </span>
              </div>
              <Link
                href="/mentor/kalender"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
              >
                <CalendarDays size={14} strokeWidth={2} aria-hidden="true" />
                Kelola slot →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                Memuat sesi...
              </div>
            ) : activeSessions.length === 0 ? (
              <div className="flex flex-col items-start justify-between gap-4 px-6 py-7 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-neutral-900">
                    Belum ada sesi mengajar terjadwal
                  </span>
                  <span className="text-xs text-neutral-500">
                    Buka slot waktu di kalendermu agar mahasiswa bisa langsung membooking sesi.
                  </span>
                </div>
                <Link
                  href="/mentor/kalender"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-600 active:scale-[0.98]"
                >
                  Atur ketersediaan slot
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {activeSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-xs font-extrabold tracking-tight text-brand-700">
                        {getInitials(s.studentName)}
                      </div>
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-neutral-900">
                            {s.subjectName}
                          </span>
                          <Badge type="status">
                            {s.status === "diterima" ? "Terkonfirmasi" : "Escrow Aktif"}
                          </Badge>
                        </div>
                        <span className="truncate text-xs text-neutral-500">
                          Mahasiswa: <strong className="font-semibold text-neutral-700">{s.studentName}</strong>
                          {s.topic ? ` • ${s.topic}` : ""}
                        </span>
                        <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-neutral-600">
                          <span className="flex items-center gap-1 font-semibold text-brand-700">
                            <CalendarCheck size={13} strokeWidth={2} aria-hidden="true" />
                            {dateFmt(s.startsAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} strokeWidth={1.75} className="text-neutral-400" aria-hidden="true" />
                            {timeFmt(s.startsAt)}–{timeFmt(s.endsAt)} WIB ({s.durationMinutes} mnt)
                          </span>
                          <span className="flex items-center gap-1">
                            {s.mode === "online" ? (
                              <Video size={13} strokeWidth={1.75} className="text-neutral-400" />
                            ) : (
                              <MapPin size={13} strokeWidth={1.75} className="text-neutral-400" />
                            )}
                            {s.mode === "online" ? "Online" : "Tatap muka"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-sm font-extrabold text-neutral-900">
                        {rp(s.total)}
                      </span>
                      <span className="text-[11px] font-medium text-neutral-400">
                        #{s.reference}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Riwayat Sesi Selesai */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-base font-bold tracking-tight text-neutral-900">
                  Riwayat sesi selesai
                </h2>
                <span className="text-xs text-neutral-500">
                  Kelas yang sudah selesai dan dananya telah diteruskan ke saldo dompetmu
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-400">
                {completedHistory.length} sesi
              </span>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                Memuat riwayat...
              </div>
            ) : completedHistory.length === 0 ? (
              <div className="px-6 py-7 text-xs text-neutral-500">
                Belum ada riwayat sesi mengajar yang selesai.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {completedHistory.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50 text-xs font-extrabold tracking-tight text-neutral-700">
                        {getInitials(s.studentName)}
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-bold text-neutral-900">
                          {s.studentName}
                        </span>
                        <span className="truncate text-xs text-neutral-500">
                          {s.subjectName} • {dateFmt(s.startsAt)} ({s.durationMinutes} mnt)
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="text-xs font-bold text-neutral-900">
                        {rp(s.total)}
                      </span>
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                        Selesai
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Widget Column: Notifikasi + Aktivitas Dompet */}
        <div className="flex flex-col gap-5">
          {/* Widget 1: Notifikasi */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Notifikasi</h3>
              <span className="text-xs font-medium text-neutral-400">
                {notifs.filter((n) => !n.isRead).length} baru
              </span>
            </div>

            {loading ? (
              <p className="border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                Memuat notifikasi...
              </p>
            ) : notifs.length === 0 ? (
              <p className="border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                Belum ada notifikasi baru.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                {notifs.slice(0, 4).map((n) => {
                  const meta = NOTIF_META[n.category] || NOTIF_META.sistem;
                  return (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 py-3 first:pt-3.5 last:pb-0"
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}
                      >
                        {meta.icon}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-xs font-bold text-neutral-900">
                            {n.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-neutral-400">
                            {notifTimeFmt(n.createdAt)}
                          </span>
                        </div>
                        {n.body && (
                          <span className="line-clamp-2 text-xs text-neutral-500">
                            {n.body}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Widget 2: Aktivitas Dompet Terakhir */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">
                Mutasi dompet
              </h3>
              <Link
                href="/mentor/dompet"
                className="text-xs font-bold text-brand-700 hover:underline"
              >
                Buka dompet →
              </Link>
            </div>

            {loading ? (
              <p className="border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                Memuat mutasi...
              </p>
            ) : entries.length === 0 ? (
              <p className="border-t border-neutral-100 pt-4 text-xs text-neutral-400">
                Belum ada mutasi saldo dompet.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                {entries.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-3.5 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                          a.type === "in"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {a.type === "in" ? (
                          <ArrowDownLeft size={14} strokeWidth={2} />
                        ) : (
                          <ArrowUpRight size={14} strokeWidth={2} />
                        )}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-xs font-bold text-neutral-900">
                          {a.description}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {dateFmt(a.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-bold ${
                        a.type === "in" ? "text-brand-700" : "text-neutral-900"
                      }`}
                    >
                      {rpSigned(a.amount, a.type)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
