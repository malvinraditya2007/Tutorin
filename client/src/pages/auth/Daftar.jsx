import * as React from "react";
import Link from "@/lib/link";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { FormField, Eyebrow } from "@/components/ui";
import { useAuth } from "@/auth/auth";

const ROLES = [
  {
    value: "mahasiswa",
    title: "Saya ingin belajar",
    desc: "Sebagai mahasiswa",
    icon: <BookOpen className="size-[18px]" />,
  },
  {
    value: "mentor",
    title: "Saya ingin menjadi mentor",
    desc: "Bagikan keahlianmu",
    icon: <GraduationCap className="size-[18px]" />,
  },
];

function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function DaftarPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = React.useState("mahasiswa");
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agree, setAgree] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const strength = scorePassword(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("Setujui Syarat & Ketentuan untuk melanjutkan.");
      return;
    }
    setLoading(true);
    try {
      await register({ fullName, email, password, role });
      if (role === "mentor") {
        navigate("/onboarding-mentor/mata-kuliah");
      } else {
        navigate("/mahasiswa/dashboard");
      }
    } catch (err) {
      setError(err.message || "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-11 pb-8">
      <div className="flex w-[500px] max-w-full flex-col gap-4">
        {/* Hero */}
        <div className="flex flex-col gap-2">
          <Eyebrow>✨ Akun barumu menanti</Eyebrow>
          <h1 className="text-[40px] font-black leading-[1.08] text-ink">
            Daftar ke Tutorin
          </h1>
          <p className="text-[15px] text-ink-muted">
            Pilih peranmu, lalu buat akun dalam beberapa langkah.
          </p>
        </div>

        {/* Role selection */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-bold text-ink">
            Saya mendaftar sebagai
          </legend>
          <div className="flex gap-3">
            {ROLES.map((r) => {
              const active = r.value === role;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  aria-pressed={active}
                  className={`flex flex-1 items-center gap-3 rounded-[14px] border p-3.5 text-left transition-colors ${
                    active
                      ? "border-brand-500 bg-brand-tint"
                      : "border-cream-border bg-white hover:border-brand-300"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      r.value === "mentor"
                        ? "bg-tag-bg text-tag-text"
                        : "bg-brand-500 text-white"
                    }`}
                  >
                    {r.icon}
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="text-sm font-bold text-ink">{r.title}</span>
                    <span className="text-xs text-ink-muted">{r.desc}</span>
                  </span>
                  {active && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-brand-500 text-white">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Account details + submit */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <FormField
            label="Nama lengkap"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Contoh: Arif Pratama"
            leftIcon={<User className="size-[18px]" />}
            required
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="arif.pratama@ui.ac.id"
            leftIcon={<Mail className="size-[18px]" />}
            required
          />

          {/* Password + strength meter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs font-bold text-ink">
              Password
            </label>
            <div className="flex h-14 items-center gap-3 rounded-[14px] border border-cream-border bg-white px-4 transition-colors focus-within:border-brand-500">
              <Lock className="size-[18px] shrink-0 text-brand-650" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={8}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="shrink-0 text-ink-muted transition-colors hover:text-ink"
              >
                {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>
            <div className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i < strength ? "bg-brand-500" : "bg-cream-border"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-ink-muted">
              Minimal 8 karakter.
            </p>
          </div>

          {/* Terms */}
          <button
            type="button"
            onClick={() => setAgree((v) => !v)}
            aria-pressed={agree}
            className="flex items-start gap-2.5 text-left text-[13px] text-ink-muted"
          >
            <span
              className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-md border transition-colors ${
                agree ? "border-brand-500 bg-brand-500 text-white" : "border-cream-border bg-white"
              }`}
            >
              {agree && <Check className="size-3" aria-hidden="true" />}
            </span>
            <span>
              Saya menyetujui{" "}
              <Link href="/syarat" className="font-bold text-ink">
                Syarat &amp; Ketentuan
              </Link>{" "}
              serta{" "}
              <Link href="/privasi" className="font-bold text-ink">
                Kebijakan Privasi
              </Link>{" "}
              Tutorin.
            </span>
          </button>

          {error && (
            <p className="rounded-[14px] border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-[13px] font-bold text-danger-600">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-brand-500 px-6 text-sm font-bold text-white shadow-[0px_10px_24px_0px_rgba(10,167,154,0.18)] transition-colors hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Memproses…" : "Daftar"}
            <ArrowRight className="size-[18px]" aria-hidden="true" />
          </button>
        </form>

        <p className="text-center text-[13px] text-ink-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-extrabold text-brand-650">
            Masuk
          </Link>
        </p>

        {/* Security note */}
        <div className="flex items-center gap-3 rounded-[14px] border border-cream-border bg-surface p-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-650">
            <ShieldCheck className="size-[18px]" aria-hidden="true" />
          </span>
          <p className="text-xs leading-normal text-ink-muted">
            <span className="font-bold text-ink">Datamu tetap aman.</span>{" "}
            Tutorin mengenkripsi data akun dan tidak pernah membagikan passwordmu.
          </p>
        </div>
      </div>
    </div>
  );
}
