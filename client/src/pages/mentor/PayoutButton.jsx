import * as React from "react";
import { ArrowDownToLine } from "lucide-react";
import { api } from "@/lib/api";
import { rp } from "@/lib/money";

/**
 * Tombol "Cairkan" (client). Mencairkan seluruh saldo tersedia ke rekening
 * utama. Menampilkan pesan error bila gagal.
 */
export function PayoutButton({
  availableBalance = 0,
  accountId = null,
  onSuccess,
}) {
  const [error, setError] = React.useState(null);
  const [pending, setPending] = React.useState(false);

  const disabled = pending || availableBalance <= 0 || !accountId;

  async function handleClick() {
    if (!accountId || disabled) return;
    setError(null);
    setPending(true);
    try {
      await api.post("/mentor/payouts", {
        amount: availableBalance,
        accountId,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.message || "Gagal memproses pencairan dana.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 text-xs font-bold tracking-tight text-white transition duration-150 hover:bg-brand-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-500/45"
      >
        <ArrowDownToLine size={16} strokeWidth={2} aria-hidden="true" />
        {pending ? "Memproses…" : `Cairkan ${rp(availableBalance)}`}
      </button>
      {!accountId && (
        <span className="text-[11px] text-neutral-500">
          Tambahkan rekening tujuan untuk mencairkan dana.
        </span>
      )}
      {error && <span className="text-[11px] font-medium text-danger-600">{error}</span>}
    </div>
  );
}
