import * as React from "react";
import Link from "@/lib/link";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Check, AlertTriangle } from "lucide-react";
import { FormField, Eyebrow } from "@/components/ui";
import { useAuth, homeForRole } from "@/auth/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const pesan = searchParams.get("pesan");
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (callbackUrl) {
        navigate(callbackUrl, { replace: true });
      } else {
        navigate(homeForRole(user.role), { replace: true });
      }
    } catch (err) {
      setError(err.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-11 pb-8">
      {/* Hero */}
      <div className="flex w-[760px] max-w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Eyebrow>👋 Selamat datang kembali</Eyebrow>
          <h1 className="text-center text-[42px] font-black leading-[1.08] text-ink">
            Masuk ke Tutorin
          </h1>
          <p className="text-center text-[15px] leading-relaxed text-ink-muted">
            Lanjutkan belajar, cek booking, atau kelola jadwal mentormu.
          </p>
        </div>

        {pesan === "login-dulu" && (
          <div className="flex w-full items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            <AlertTriangle className="size-5 shrink-0" />
            <p className="text-[13px] font-medium leading-relaxed">
              Ups, kamu harus masuk (login) dulu sebelum bisa mencari atau melihat profil tutor. 
              Belum punya akun? Silakan daftar gratis di bawah.
            </p>
          </div>
        )}

        {/* Form email/password */}
        <div className="flex w-[466px] max-w-full flex-col gap-[22px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            {/* Password dengan toggle */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-bold leading-none text-ink"
              >
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
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="shrink-0 text-ink-muted transition-colors hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" />
                  ) : (
                    <Eye className="size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Ingat saya + lupa password */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="flex items-center gap-2 text-[13px] text-ink"
                aria-pressed={remember}
              >
                <span
                  className={`flex size-[18px] items-center justify-center rounded-md border transition-colors ${
                    remember
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-cream-border bg-white"
                  }`}
                >
                  {remember && <Check className="size-3" aria-hidden="true" />}
                </span>
                Ingat saya
              </button>
              <Link
                href="/lupa-password"
                className="text-[13px] font-bold text-brand-650 hover:opacity-80"
              >
                Lupa password?
              </Link>
            </div>

            {error && (
              <p className="rounded-[14px] border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-[13px] font-bold text-danger-600">
                {error}
              </p>
            )}

            {/* Tombol masuk */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-brand-500 px-6 text-sm font-bold text-white shadow-[0px_10px_24px_0px_rgba(10,167,154,0.18)] transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Memproses…" : "Masuk"}
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </button>
          </form>

          <p className="text-center text-[13px] text-ink-muted">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-extrabold text-brand-650">
              Daftar gratis
            </Link>
          </p>

          {/* Security note */}
          <div className="flex items-center gap-3 rounded-[14px] border border-cream-border bg-surface p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand-650">
              <ShieldCheck className="size-[18px]" aria-hidden="true" />
            </span>
            <p className="text-xs leading-normal text-ink-muted">
              <span className="font-bold text-ink">
                Akun dan transaksimu terlindungi.
              </span>{" "}
              Tutorin mengenkripsi data masuk dan tidak pernah membagikan
              passwordmu.
            </p>
          </div>

          <p className="text-center text-[10px] leading-normal text-ink-muted">
            Dengan masuk, kamu menyetujui{" "}
            <Link href="/syarat" className="font-bold text-ink">
              Syarat Penggunaan
            </Link>{" "}
            dan{" "}
            <Link href="/privasi" className="font-bold text-ink">
              Kebijakan Privasi
            </Link>{" "}
            Tutorin.
          </p>
        </div>
      </div>
    </div>
  );
}
