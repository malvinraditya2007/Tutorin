import * as React from "react";
import Link from "@/lib/link";
import { KeyRound, Mail, ArrowRight, MailCheck } from "lucide-react";
import { FormField } from "@/components/ui";

export default function LupaPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-11 py-12">
      <div className="flex w-[480px] max-w-full flex-col items-center gap-6 rounded-xl border border-neutral-200/80 bg-white p-8">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-brand-700">
          <KeyRound size={14} strokeWidth={1.75} aria-hidden="true" />
          Pulihkan akses akun
        </span>

        <div className="flex flex-col items-center gap-2.5">
          <h1 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
            Lupa password?
          </h1>
          <p className="max-w-prose text-center text-sm leading-relaxed text-neutral-600">
            Masukkan email akunmu. Kami akan mengirim tautan untuk membuat
            password baru.
          </p>
        </div>

        {submitted ? (
          <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-success-500/20 bg-success-50 p-4 text-center">
            <span className="text-sm font-semibold text-success-700">Tautan reset terkirim!</span>
            <p className="text-xs text-neutral-600">
              Periksa kotak masuk email <span className="font-semibold text-neutral-800">{email}</span> untuk instruksi pengaturan ulang password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <FormField
              label="Email akun"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arif.pratama@ui.ac.id"
              leftIcon={<Mail className="size-[18px]" />}
              required
            />
            <button
              type="submit"
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-accent-600 active:scale-[0.98]"
            >
              Kirim tautan reset
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </form>
        )}

        <div className="flex w-full items-center gap-3 rounded-lg border border-brand-100 bg-brand-50 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700">
            <MailCheck size={18} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-neutral-900">
              Cek folder spam juga
            </span>
            <span className="text-xs leading-normal text-neutral-600">
              Tautan reset berlaku terbatas demi keamanan akunmu.
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="text-sm font-medium text-brand-700 transition hover:underline"
        >
          ← Kembali ke Login
        </Link>
      </div>
    </div>
  );
}
