import * as React from "react";
import Link from "@/lib/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Star,
  Wallet,
  Settings,
  Video,
  MapPin,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { AccountHeader, Badge } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { rp } from "@/lib/money";
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

const TX_TONE = {
  teal: "bg-brand-50 text-brand-700",
  peach: "bg-amber-50 text-amber-700",
  neutral: "bg-neutral-100 text-neutral-500",
};

export default function DashboardMahasiswaPage() {
  const { user } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    upcoming: [],
    done: [],
    summary: { escrowActive: 0, totalPaid: 0, escrowCount: 0, completedCount: 0 },
    transactions: [],
    notifs: [],
    reviewable: [],
  });

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get("/student/sessions"),
      api.get("/student/transactions"),
      api.get("/notifications"),
      api.get("/reviews/reviewable"),
    ])
      .then(([sessions, txData, notifData, revData]) => {
        if (!active) return;
        setData({
          upcoming: sessions.upcoming || [],
          done: sessions.done || [],
          summary: txData.summary || { escrowActive: 0, totalPaid: 0, escrowCount: 0, completedCount: 0 },
          transactions: txData.transactions || [],
          notifs: notifData.notifications || [],
          reviewable: revData.bookings || [],
        });
      })
      .catch((err) => {
        console.error("Failed to load mahasiswa dashboard:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const { upcoming, done, summary, transactions, notifs, reviewable } = data;
  const reviewableIds = new Set(reviewable.map((b) => b.id));
  const recentDone = [...done].reverse().slice(0, 3);

  const metrics = [
    {
      label: "SESI AKTIF",
      value: String(upcoming.length),
      caption: `${done.length} sesi selesai`,
      color: "text-neutral-900",
    },
    {
      label: "DANA ESCROW",
      value: rp(summary.escrowActive),
      caption: `${summary.escrowCount} booking aktif`,
      color: "text-neutral-900",
    },
    {
      label: "TOTAL DIBAYAR",
      value: rp(summary.totalPaid),
      caption: `${summary.completedCount} transaksi selesai`,
      color: "text-neutral-900",
    },
  ];

  return (
    <>
      <AccountHeader
        title={`Halo, ${user?.fullName ? user.fullName.split(" ")[0] : "Mahasiswa"}!`}
        subtitle="Ringkasan aktivitas belajarmu hari ini."
        userName={user?.fullName}
        userRole={user?.campus ? `Mahasiswa ${user.campus}` : "Mahasiswa"}
        avatarUrl={user?.avatarUrl ?? "/avatar-default.svg"}
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-7 px-8 py-6 xl:grid-cols-[1fr_340px]">
        {/* Left Main Column */}
        <div className="flex min-w-0 flex-col gap-7">
          {/* 3 Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold tracking-wider text-neutral-400">
                    {m.label}
                  </span>
                  <span className="size-2 rounded-full bg-brand-500" />
                </div>
                <div className="flex flex-col">
                  <span className={`text-2xl font-extrabold tracking-tight ${m.color}`}>
                    {loading ? "…" : m.value}
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    {m.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sesi Mendatang */}
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-neutral-900">
                  Sesi Mendatang
                </h2>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                  {upcoming.length}
                </span>
              </div>
              <Link
                href="/cari-tutor"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
              >
                Cari tutor baru
                <ArrowRight size={13} strokeWidth={2.5} />
              </Link>
            </div>

            {loading ? (
              <div className="flex h-36 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-xs text-neutral-400">
                Memuat sesi...
              </div>
            ) : upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-8 text-center">
                <p className="text-sm font-semibold text-neutral-700">
                  Belum ada sesi belajar mendatang
                </p>
                <p className="max-w-sm text-xs text-neutral-500">
                  Pilih tutor yang cocok dan jadwalkan sesi privat 1-on-1 pertamamu.
                </p>
                <Link
                  href="/cari-tutor"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-600"
                >
                  Cari tutor sekarang
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {upcoming.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={s.mentorPhoto}
                        alt={s.mentorName}
                        className="size-13 rounded-2xl border border-neutral-100 object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-neutral-900">
                            {s.mentorName}
                          </span>
                          <Badge type="verified">Tutor</Badge>
                        </div>
                        <span className="text-xs font-semibold text-brand-700">
                          {s.subjectName}
                          {s.topic ? ` — ${s.topic}` : ""}
                        </span>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={13} strokeWidth={2} className="text-neutral-400" />
                            {dateFmt(s.startsAt)}, {timeFmt(s.startsAt)}–{timeFmt(s.endsAt)} WIB
                          </span>
                          <span className="inline-flex items-center gap-1">
                            {s.mode === "online" ? (
                              <Video size={13} strokeWidth={2} className="text-neutral-400" />
                            ) : (
                              <MapPin size={13} strokeWidth={2} className="text-neutral-400" />
                            )}
                            {s.mode === "online" ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center">
                      {s.discordUrl ? (
                        <a
                          href={s.discordUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-600 active:scale-[0.98]"
                        >
                          Masuk Discord
                          <ExternalLink size={13} strokeWidth={2.5} />
                        </a>
                      ) : (
                        <span className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-500">
                          Menunggu link
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Riwayat Sesi Terakhir */}
          {recentDone.length > 0 && (
            <section className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold tracking-tight text-neutral-900">
                  Riwayat Sesi Terakhir
                </h2>
                <Link
                  href="/mahasiswa/ulasan"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                >
                  Lihat semua ulasan
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                {recentDone.map((s) => {
                  const needsReview = reviewableIds.has(s.id);
                  return (
                    <div
                      key={s.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.mentorPhoto}
                            alt={s.mentorName}
                            className="size-9 rounded-xl object-cover"
                          />
                          <div className="flex min-w-0 flex-col">
                            <span className="truncate text-xs font-bold text-neutral-900">
                              {s.mentorName}
                            </span>
                            <span className="truncate text-[11px] text-neutral-400">
                              {s.subjectName}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                          {dateFmt(s.startsAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5">
                        {needsReview ? (
                          <Link
                            href={`/mahasiswa/ulasan?bookingId=${s.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
                          >
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            Beri rating
                          </Link>
                        ) : (
                          <span className="text-[11px] font-medium text-neutral-400">
                            Sudah diulas
                          </span>
                        )}
                        <Link
                          href={`/tutor/${s.mentorId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:underline"
                        >
                          <RotateCcw size={11} strokeWidth={2.5} />
                          Booking lagi
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Riwayat Transaksi */}
          <section className="flex flex-col gap-3.5">
            <h2 className="text-base font-extrabold tracking-tight text-neutral-900">
              Riwayat Pembayaran
            </h2>
            {loading ? (
              <div className="flex h-24 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-xs text-neutral-400">
                Memuat transaksi...
              </div>
            ) : transactions.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 text-center text-xs text-neutral-400">
                Belum ada transaksi.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
                <div className="divide-y divide-neutral-100">
                  {transactions.slice(0, 5).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-5 py-3.5 text-xs"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-neutral-900">
                          {t.subjectName} — {t.mentorName}
                        </span>
                        <span className="text-neutral-400">
                          {dateFmt(t.date)} • {t.durationMinutes} mnt
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-neutral-900">
                          {rp(t.total)}
                        </span>
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[11px] font-bold ${
                            TX_TONE[t.tone] || "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {t.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Aside Column: Notifikasi Ringkas */}
        <aside className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold tracking-tight text-neutral-900">
              Notifikasi
            </h2>
            <Link
              href="/mahasiswa/notifikasi"
              className="text-xs font-bold text-brand-700 hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-2">
            {loading ? (
              <div className="p-6 text-center text-xs text-neutral-400">Memuat...</div>
            ) : notifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-400">
                Tidak ada notifikasi baru.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-neutral-100">
                {notifs.slice(0, 5).map((n) => {
                  const meta = NOTIF_META[n.category] || NOTIF_META.sistem;
                  return (
                    <div key={n.id} className="flex items-start gap-3 p-3">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-xl ${meta.tone}`}
                      >
                        {meta.icon}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-xs font-bold text-neutral-900">
                          {n.title}
                        </span>
                        {n.body && (
                          <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-500">
                            {n.body}
                          </p>
                        )}
                        <span className="text-[10px] text-neutral-400">
                          {notifTimeFmt(n.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
