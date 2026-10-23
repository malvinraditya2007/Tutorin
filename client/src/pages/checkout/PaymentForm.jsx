import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CreditCard, Wallet, Building2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { rp } from "@/lib/money";

const METHODS = [
  { id: "ewallet", label: "E-wallet", desc: "GoPay, OVO, Dana", icon: <Wallet className="size-5" /> },
  { id: "va", label: "Virtual account", desc: "BCA, Mandiri, BNI", icon: <Building2 className="size-5" /> },
  { id: "card", label: "Kartu kredit/debit", desc: "Visa, Mastercard", icon: <CreditCard className="size-5" /> },
];

export function PaymentForm({
  bookingId,
  amount,
  serviceFee,
  total,
  durationMinutes,
}) {
  const navigate = useNavigate();
  const [method, setMethod] = React.useState("ewallet");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post(`/bookings/${bookingId}/pay`, { method });
      navigate(`/konfirmasi?booking=${bookingId}`);
    } catch (err) {
      setError(err.message || "Pembayaran gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handlePay}
      className="sticky top-6 flex flex-col gap-5 rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm"
    >
      <h2 className="text-base font-semibold tracking-tight text-neutral-900">Metode pembayaran</h2>

      {error && (
        <div className="rounded-lg bg-danger-50 p-2.5 text-xs font-medium text-danger-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {METHODS.map((m) => {
          const active = m.id === method;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition duration-150 active:scale-[0.99] ${
                active ? "border-brand-600 bg-brand-50" : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-500"}`}>
                {m.icon}
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-neutral-900">{m.label}</span>
                <span className="text-xs text-neutral-500">{m.desc}</span>
              </span>
              <span className={`flex size-4 items-center justify-center rounded-full border ${active ? "border-brand-600 bg-brand-600 text-white" : "border-neutral-300"}`}>
                {active && <Check size={11} strokeWidth={2.5} aria-hidden="true" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Receipt */}
      <div className="flex flex-col gap-2.5 border-t border-neutral-100 pt-4">
        <CostRow label={`Tarif tutor • ${durationMinutes} mnt`} value={rp(amount)} />
        <CostRow label="Biaya layanan (8%)" value={rp(serviceFee)} />
        <div className="flex items-center justify-between border-t border-neutral-100 pt-2.5">
          <span className="font-semibold text-neutral-900">Total pembayaran</span>
          <span className="font-mono text-lg font-semibold text-neutral-900">{rp(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-accent-500 text-sm font-semibold tracking-tight text-white transition duration-150 hover:bg-accent-600 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? "Memproses…" : "Bayar sekarang"}
        <Lock size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <p className="text-center text-[11px] leading-normal text-neutral-400">
        Dengan melanjutkan, kamu menyetujui rincian booking dan ketentuan yang
        ditampilkan pada transaksi ini.
      </p>
    </form>
  );
}

function CostRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm text-neutral-500">
      <span>{label}</span>
      <span className="font-mono text-neutral-700">{value}</span>
    </div>
  );
}
