import * as React from "react";
import { useSearchParams } from "react-router-dom";
import Link from "@/lib/link";
import {
  CalendarCheck,
  Clock,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  RotateCcw,
  MessageSquareQuote,
} from "lucide-react";
import { AccountHeader } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { ReviewForm } from "./ReviewForm";

const dateFmt = (d) =>
  new Date(d).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const timeFmt = (d) =>
  new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

function MentorAvatar({ photoUrl, name, size = "md" }) {
  const isDefault = !photoUrl || photoUrl === "/avatar-default.svg";
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "M";

  const dim = size === "lg" ? "size-14 text-base rounded-2xl" : "size-11 text-xs rounded-xl";

  if (isDefault) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center border border-brand-100 bg-brand-50 font-extrabold tracking-tight text-brand-700 ${dim}`}
      >
        {initials || "M"}
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      className={`shrink-0 bg-neutral-100 object-cover ${dim}`}
    />
  );
}

export default function UlasanPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const bookingId = searchParams.get("bookingId");

  const [bookings, setBookings] = React.useState([]);
  const [submitted, setSubmitted] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [sukses, setSukses] = React.useState(false);

  const loadData = React.useCallback(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get("/reviews/reviewable"),
      api.get("/reviews/submitted"),
      api.get("/highlight-tags"),
    ])
      .then(([revData, subData, tagData]) => {
        if (!active) return;
        setBookings(revData.bookings || []);
        setSubmitted(subData.reviews || []);
        setTags(tagData.tags || []);
      })
      .catch((err) => {
        console.error("Failed to load ulasan data:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const target =
    (bookingId ? bookings.find((b) => b.id === bookingId) : bookings[0]) ??
    bookings[0] ??
    null;

  return (
    <>
      <AccountHeader
        title="Ulasan Sesi"
        subtitle="Bagikan pengalaman belajarmu dan lihat riwayat ulasan yang pernah kamu kirim."
        userName={user?.fullName}
        userRole={user?.campus ? `Mahasiswa ${user.campus}` : "Mahasiswa"}
        avatarUrl={user?.avatarUrl ?? "/avatar-default.svg"}
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-7 px-8 py-7">
        {sukses && (
          <div className="flex items-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-xs font-bold text-brand-700">
            <CheckCircle2 size={16} strokeWidth={2.2} aria-hidden="true" />
            Ulasan berhasil dikirim. Terima kasih sudah membantu mahasiswa lain!
          </div>
        )}

        {/* Section 1: Sesi Menunggu Ulasan */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold tracking-tight text-neutral-900">
                Menunggu ulasan
              </h2>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                {bookings.length} sesi
              </span>
            </div>
          </div>

          {bookings.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              {bookings.map((b) => {
                const active = target?.id === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set("bookingId", b.id);
                      setSearchParams(next);
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      active
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-neutral-200/90 bg-white text-neutral-700 hover:border-brand-300"
                    }`}
                  >
                    <span>{b.subjectName}</span>
                    <span
                      className={`text-[11px] font-medium ${
                        active ? "text-white/80" : "text-neutral-400"
                      }`}
                    >
                      • {b.mentorName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="flex h-36 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-xs text-neutral-400">
              Memuat ulasan...
            </div>
          ) : !target ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-6 py-12 text-center">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <CheckCircle2 size={20} strokeWidth={2} />
              </div>
              <p className="mt-1 text-sm font-bold text-neutral-900">
                Semua sesi sudah kamu ulas
              </p>
              <p className="max-w-sm text-xs text-neutral-500">
                Ulasan baru akan terbuka otomatis setelah jadwal sesi belajarmu
                selesai.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">
              {/* Session Summary Card */}
              <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6">
                <div className="flex items-center gap-3.5">
                  <MentorAvatar
                    photoUrl={target.mentorPhoto}
                    name={target.mentorName}
                    size="lg"
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-base font-extrabold tracking-tight text-neutral-900">
                      {target.mentorName}
                    </span>
                    <span className="truncate text-xs font-medium text-neutral-500">
                      {target.mentorProgram}
                    </span>
                  </div>
                </div>

                <div className="h-px w-full bg-neutral-100" />

                <div className="flex flex-col gap-3">
                  <SummaryRow
                    icon={<CalendarCheck size={15} strokeWidth={2} />}
                    label="Mata kuliah"
                    value={`${target.subjectName}${
                      target.topic ? ` — ${target.topic}` : ""
                    }`}
                  />
                  <SummaryRow
                    icon={<Clock size={15} strokeWidth={2} />}
                    label="Waktu sesi"
                    value={`${dateFmt(target.startsAt)} • ${timeFmt(
                      target.startsAt
                    )} WIB`}
                  />
                  <SummaryRow
                    icon={
                      target.mode === "online" ? (
                        <Video size={15} strokeWidth={2} />
                      ) : (
                        <MapPin size={15} strokeWidth={2} />
                      )
                    }
                    label="Format & durasi"
                    value={`${target.durationMinutes} menit • ${
                      target.mode === "online" ? "Online" : "Tatap muka"
                    }`}
                  />
                </div>
              </div>

              <ReviewForm
                key={target.id}
                bookingId={target.id}
                highlights={tags.map((t) => t.label)}
                onSuccess={() => {
                  setSukses(true);
                  loadData();
                }}
              />
            </div>
          )}
        </section>

        {/* Section 2: Riwayat Ulasanmu */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-extrabold tracking-tight text-neutral-900">
                Riwayat ulasanmu
              </h2>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-600">
                {submitted.length} ulasan
              </span>
            </div>
          </div>

          {submitted.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-6 py-12 text-center">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                <MessageSquareQuote size={20} strokeWidth={1.75} />
              </div>
              <p className="mt-1 text-sm font-bold text-neutral-900">
                Belum ada riwayat ulasan
              </p>
              <p className="max-w-sm text-xs text-neutral-500">
                Ulasan yang sudah kamu kirimkan untuk tutor akan tersimpan di
                sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {submitted.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5"
                >
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <MentorAvatar
                          photoUrl={r.mentorPhoto}
                          name={r.mentorName}
                        />
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-sm font-bold text-neutral-900">
                            {r.mentorName}
                          </span>
                          <span className="truncate text-xs font-medium text-neutral-500">
                            {r.subjectName} • {dateFmt(r.startsAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>

                    {r.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {r.highlights.map((h) => (
                          <span
                            key={h}
                            className="rounded-lg bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-700"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {r.comment ? (
                      <p className="text-xs leading-relaxed text-neutral-600">
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs italic text-neutral-400">
                        Tanpa komentar tertulis.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-[11px] font-medium text-neutral-400">
                      {r.isAnonymous ? "Dikirim sebagai anonim" : "Dikirim publik"}
                    </span>
                    <Link
                      href={`/tutor/${r.mentorId}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 transition hover:border-brand-300 hover:text-brand-700"
                    >
                      <RotateCcw size={12} strokeWidth={2} aria-hidden="true" />
                      Booking lagi
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-neutral-400">{label}</span>
        <span className="text-xs font-bold text-neutral-800">{value}</span>
      </div>
    </div>
  );
}
