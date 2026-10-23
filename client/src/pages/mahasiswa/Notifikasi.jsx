import * as React from "react";
import Link from "@/lib/link";
import {
  CalendarCheck,
  Wallet,
  Star,
  Settings,
  BellOff,
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import { AccountHeader } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";

const CATEGORY_META = {
  sesi: {
    label: "Sesi",
    icon: <CalendarCheck size={17} strokeWidth={2} />,
    iconTone: "bg-brand-50 text-brand-700 border border-brand-100",
    badgeTone: "bg-brand-50 text-brand-700",
  },
  pembayaran: {
    label: "Pembayaran",
    icon: <Wallet size={17} strokeWidth={2} />,
    iconTone: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    badgeTone: "bg-emerald-50 text-emerald-700",
  },
  ulasan: {
    label: "Ulasan",
    icon: <Star size={17} strokeWidth={2} />,
    iconTone: "bg-amber-50 text-amber-700 border border-amber-100",
    badgeTone: "bg-amber-50 text-amber-700",
  },
  sistem: {
    label: "Sistem",
    icon: <Settings size={17} strokeWidth={2} />,
    iconTone: "bg-neutral-100 text-neutral-600 border border-neutral-200/80",
    badgeTone: "bg-neutral-100 text-neutral-600",
  },
};

const timeFmt = (d) =>
  new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function NotifikasiPage() {
  const { user } = useAuth();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("semua");
  const [marking, setMarking] = React.useState(false);

  const fetchNotifs = React.useCallback(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get("/notifications"),
      api.get("/reviews/reviewable"),
    ])
      .then(([notifData, revData]) => {
        if (!active) return;
        const reviewableIds = new Set((revData.bookings || []).map((b) => b.id));
        const list = (notifData.notifications || []).map((n) => ({
          ...n,
          createdAtLabel: timeFmt(n.createdAt),
          canReview:
            n.category === "sesi" &&
            n.title === "Sesi selesai" &&
            n.bookingId != null &&
            reviewableIds.has(n.bookingId),
        }));
        setItems(list);
      })
      .catch((err) => {
        console.error("Failed to load notifications:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  React.useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await api.post("/notifications/read-all");
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarking(false);
    }
  };

  const unreadCount = items.filter((n) => !n.isRead).length;

  const filtered = React.useMemo(() => {
    if (activeTab === "semua") return items;
    if (activeTab === "unread") return items.filter((n) => !n.isRead);
    return items.filter((n) => n.category === activeTab);
  }, [items, activeTab]);

  const tabs = [
    { key: "semua", label: "Semua", count: items.length },
    { key: "unread", label: "Belum dibaca", count: unreadCount },
    {
      key: "sesi",
      label: "Sesi kuliah",
      count: items.filter((n) => n.category === "sesi").length,
    },
    {
      key: "pembayaran",
      label: "Pembayaran",
      count: items.filter((n) => n.category === "pembayaran").length,
    },
    {
      key: "ulasan",
      label: "Ulasan",
      count: items.filter((n) => n.category === "ulasan").length,
    },
  ];

  return (
    <>
      <AccountHeader
        title="Notifikasi"
        subtitle="Pembaruan jadwal sesi, pembayaran escrow, dan pengingat ulasan."
        userName={user?.fullName}
        userRole={user?.campus ? `Mahasiswa ${user.campus}` : "Mahasiswa"}
        avatarUrl={user?.avatarUrl ?? "/avatar-default.svg"}
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-8 py-7">
        <div className="flex flex-col gap-5">
          {/* Filter & Action Bar */}
          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-1.5">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      active
                        ? "bg-brand-600 text-white"
                        : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white text-neutral-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={marking || unreadCount === 0}
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/90 bg-white px-3.5 py-2 text-xs font-bold text-neutral-700 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <CheckCheck size={14} strokeWidth={2.2} aria-hidden="true" />
              {marking ? "Menyimpan…" : "Tandai semua dibaca"}
            </button>
          </div>

          {/* Notification List Card */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
            {loading ? (
              <div className="p-12 text-center text-xs text-neutral-400">
                Memuat notifikasi...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                  <BellOff size={20} strokeWidth={1.75} />
                </div>
                <p className="mt-1 text-sm font-bold text-neutral-900">
                  Tidak ada notifikasi di kategori ini
                </p>
                <p className="max-w-sm text-xs text-neutral-500">
                  Pembaruan jadwal sesi, status pembayaran escrow, dan pengingat
                  ulasan akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filtered.map((n) => {
                  const meta = CATEGORY_META[n.category] || CATEGORY_META.sistem;
                  return (
                    <div
                      key={n.id}
                      className={`flex flex-col justify-between gap-4 px-6 py-5 transition sm:flex-row sm:items-start ${
                        n.isRead ? "bg-white hover:bg-neutral-50/60" : "bg-brand-50/25 hover:bg-brand-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${meta.iconTone}`}
                        >
                          {meta.icon}
                        </span>

                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold tracking-tight text-neutral-900">
                              {n.title}
                            </span>
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.badgeTone}`}
                            >
                              {meta.label}
                            </span>
                            {!n.isRead && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                Baru
                              </span>
                            )}
                          </div>

                          {n.body && (
                            <p className="max-w-2xl text-xs leading-relaxed text-neutral-600">
                              {n.body}
                            </p>
                          )}

                          {n.canReview && (
                            <div className="pt-1.5">
                              <Link
                                href="/mahasiswa/ulasan"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600"
                              >
                                <Star size={12} strokeWidth={2.2} aria-hidden="true" />
                                Beri ulasan sesi ini
                              </Link>
                            </div>
                          )}
                          {!n.canReview && n.category === "sesi" && (
                            <div className="pt-1">
                              <Link
                                href="/mahasiswa/dashboard"
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                              >
                                Lihat di Beranda
                                <ArrowRight size={12} strokeWidth={2.2} />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-medium text-neutral-400">
                        {n.createdAtLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
