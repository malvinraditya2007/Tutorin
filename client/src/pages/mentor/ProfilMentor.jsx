import * as React from "react";
import { Star, BadgeCheck, Check, CheckCircle2 } from "lucide-react";
import { AccountHeader, FormField, Badge } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { rp } from "@/lib/money";
import { AvatarUpload } from "./AvatarUpload";

export default function ProfilMentorPage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = React.useState(null);
  const [allSubjects, setAllSubjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [sukses, setSukses] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [avatarUrl, setAvatarUrl] = React.useState("");

  const loadData = React.useCallback(async () => {
    try {
      const [profRes, subRes] = await Promise.all([
        api.get("/mentor/profile"),
        api.get("/subjects"),
      ]);
      setProfile(profRes?.profile || null);
      setAllSubjects(subRes?.subjects || []);
      setAvatarUrl(profRes?.profile?.user?.avatarUrl || user?.avatarUrl || "");
    } catch (err) {
      console.error("Failed to load mentor profile:", err);
      setError("Gagal memuat profil mentor.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-xs text-neutral-400">
        Memuat profil mentor…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-2 text-sm text-neutral-500">
        Profil mentor tidak ditemukan.
      </div>
    );
  }

  const subjects = profile.subjects ? profile.subjects.map((s) => s.subject.name) : [];

  // Kelengkapan profil sederhana dari field terisi.
  const checks = [
    { label: "Foto & bio", done: Boolean(avatarUrl && profile.bio) },
    { label: "Mata kuliah", done: subjects.length > 0 },
    { label: "Tarif & profil", done: profile.hourlyRate > 0 && Boolean(profile.studyProgram) },
    { label: "Link Discord", done: Boolean(profile.discordUrl) },
  ];
  const pct = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);

  const displayAvatar = avatarUrl || user?.avatarUrl;
  const isDefaultAvatar = !displayAvatar || displayAvatar === "/avatar-default.svg";
  const displayName = profile.user?.fullName || user?.fullName || "Mentor";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSukses(false);
    setError(null);
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    const university = String(fd.get("university") ?? "").trim();
    const studyProgram = String(fd.get("studyProgram") ?? "").trim();
    const headline = String(fd.get("headline") ?? "").trim();
    const hourlyRate = Number(fd.get("hourlyRate")) || 0;
    const bio = String(fd.get("bio") ?? "").trim();
    const discordUrl = String(fd.get("discordUrl") ?? "").trim();
    const formAvatarUrl = String(fd.get("avatarUrl") ?? avatarUrl ?? "");
    const subjectIds = fd.getAll("subjectIds").map(String);

    try {
      await api.put("/mentor/profile", {
        fullName,
        university,
        studyProgram,
        headline,
        hourlyRate,
        bio,
        discordUrl,
        subjectIds,
        avatarUrl: formAvatarUrl || null,
      });

      setSukses(true);
      if (refreshUser) await refreshUser();
      await loadData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err?.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AccountHeader
        title="Profil Mentor"
        subtitle="Kelola informasi yang tampil di profil publikmu."
        userName={displayName}
        userRole="Mentor"
        avatarUrl={displayAvatar ?? "/avatar-default.svg"}
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-8 py-6">
        {sukses && (
          <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-xs font-bold text-brand-700">
            <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
            Profil berhasil disimpan.
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-danger-500/30 bg-danger-50 px-4 py-3 text-xs font-bold text-danger-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr]">
          {/* Summary */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-6">
              {isDefaultAvatar ? (
                <div className="flex size-20 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-xl font-extrabold tracking-tight text-brand-700">
                  {initials}
                </div>
              ) : (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="size-20 rounded-2xl object-cover"
                />
              )}
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="flex items-center gap-1.5 text-base font-extrabold tracking-tight text-neutral-900">
                  {displayName}
                  {profile.isVerified && (
                    <BadgeCheck
                      size={17}
                      strokeWidth={2}
                      className="text-brand-600"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  {profile.studyProgram}
                  {profile.university || user?.campus ? ` • ${profile.university || user?.campus}` : ""}
                </span>
              </div>
              <div className="flex w-full justify-around border-t border-neutral-100 pt-3.5">
                <StatMini
                  value={Number(profile.ratingAvg ?? 0).toLocaleString("id-ID", {
                    minimumFractionDigits: 1,
                  })}
                  label="Rating"
                  icon={
                    <Star
                      size={13}
                      strokeWidth={2}
                      className="fill-amber-400 text-amber-400"
                    />
                  }
                />
                <StatMini value={String(profile.sessionsCompleted ?? 0)} label="Sesi" />
                <StatMini value={rp(profile.hourlyRate ?? 0)} label="Tarif/jam" />
              </div>
              {profile.isVerified && (
                <Badge type="verified">Mentor terverifikasi</Badge>
              )}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-neutral-900">
                  Kelengkapan profil
                </span>
                <span className="text-sm font-extrabold text-brand-700">
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex flex-col gap-2">
                {checks.map((c) => (
                  <span
                    key={c.label}
                    className="flex items-center gap-2 text-xs font-medium text-neutral-700"
                  >
                    <span
                      className={`flex size-4 items-center justify-center rounded-full ${
                        c.done
                          ? "bg-brand-600 text-white"
                          : "border border-neutral-300"
                      }`}
                    >
                      {c.done && (
                        <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                      )}
                    </span>
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Informasi dasar
              </h3>
              <AvatarUpload
                initialAvatarUrl={displayAvatar}
                fullName={displayName}
                onChange={setAvatarUrl}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Nama lengkap"
                  name="fullName"
                  defaultValue={displayName}
                />
                <FormField
                  label="Universitas"
                  name="university"
                  defaultValue={profile.university || ""}
                />
              </div>
              <FormField
                label="Program studi"
                name="studyProgram"
                defaultValue={profile.studyProgram || ""}
              />
              <FormField
                label="Headline (tagline singkat)"
                name="headline"
                defaultValue={profile.headline ?? ""}
                placeholder="Mis. Belajar kalkulus dari dasar sampai mahir"
              />
              <FormField
                label="Tarif per jam (Rp)"
                name="hourlyRate"
                type="number"
                defaultValue={profile.hourlyRate ?? 0}
              />
            </section>

            <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-6">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Bio singkat
              </h3>
              <textarea
                name="bio"
                rows={3}
                defaultValue={profile.bio ?? ""}
                placeholder="Ceritakan gaya mengajar dan pengalamanmu…"
                className="resize-none rounded-xl border border-neutral-200/90 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
              />
            </section>

            <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-6">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Mata kuliah yang diajar
              </h3>
              <div className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {allSubjects.map((s) => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
                  >
                    <input
                      type="checkbox"
                      name="subjectIds"
                      value={s.id}
                      defaultChecked={profile.subjects?.some(
                        (ps) => ps.subjectId === s.id
                      )}
                      className="size-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-600"
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Ruang sesi Discord
              </h3>
              <FormField
                label="Link Discord untuk sesi"
                name="discordUrl"
                defaultValue={profile.discordUrl || ""}
                placeholder="https://discord.gg/..."
                helperText="Dipakai di semua sesi mentoring online."
              />
            </section>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex h-11 items-center rounded-xl bg-brand-500 px-6 text-xs font-bold tracking-tight text-white transition duration-150 hover:bg-brand-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan…" : "Simpan perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function StatMini({
  value,
  label,
  icon,
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-1 text-sm font-extrabold text-neutral-900">
        {icon}
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </span>
    </div>
  );
}
