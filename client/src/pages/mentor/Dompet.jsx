import * as React from "react";
import {
  Building2,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  X,
  CreditCard,
} from "lucide-react";
import { AccountHeader } from "@/components/ui";
import { useAuth } from "@/auth/auth";
import { api } from "@/lib/api";
import { rp, rpSigned } from "@/lib/money";
import { formatDate } from "@/lib/datetime";
import { PayoutButton } from "./PayoutButton";

const BANK_OPTIONS = [
  "BCA",
  "Bank Mandiri",
  "BNI",
  "BRI",
  "BSI (Bank Syariah Indonesia)",
  "CIMB Niaga",
  "Permata Bank",
  "Bank Danamon",
  "Bank Jago",
];

const dateFmt = (d) =>
  formatDate(d, { day: "2-digit", month: "short", year: "numeric" });

export default function DompetPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
    wallet: null,
    entries: [],
    accounts: [],
    escrowSessions: 0,
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formBank, setFormBank] = React.useState("BCA");
  const [formNumber, setFormNumber] = React.useState("");
  const [formName, setFormName] = React.useState("");
  const [modalError, setModalError] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const res = await api.get("/mentor/wallet");
      setData({
        wallet: res?.wallet ?? null,
        entries: res?.entries ?? [],
        accounts: res?.accounts ?? [],
        escrowSessions: res?.escrowSessions ?? 0,
      });
    } catch (err) {
      console.error("Failed to load wallet data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const { wallet, entries, accounts, escrowSessions } = data;

  const available = wallet?.availableBalance ?? 0;
  const escrow = wallet?.escrowBalance ?? 0;
  const total = wallet?.totalEarnings ?? 0;
  const primaryAccount = accounts[0] ?? null;

  const handleOpenModal = () => {
    setModalError(null);
    if (primaryAccount) {
      setFormBank(primaryAccount.bankName || "BCA");
      setFormNumber(primaryAccount.accountNumber || "");
      setFormName(primaryAccount.accountName || user?.fullName || "");
    } else {
      setFormBank("BCA");
      setFormNumber("");
      setFormName(user?.fullName || "");
    }
    setIsModalOpen(true);
  };

  const handleSubmitAccount = async (e) => {
    e.preventDefault();
    setModalError(null);

    const cleanNumber = formNumber.replace(/\D/g, "");
    if (!cleanNumber || cleanNumber.length < 5) {
      setModalError("Nomor rekening minimal 5 digit angka.");
      return;
    }
    if (!formName.trim() || formName.trim().length < 2) {
      setModalError("Nama pemilik rekening minimal 2 karakter.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/mentor/payout-account", {
        bankName: formBank,
        accountNumber: cleanNumber,
        accountName: formName.trim(),
      });
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      setModalError(err?.message || "Gagal menyimpan rekening.");
    } finally {
      setSubmitting(false);
    }
  };

  const metrics = [
    {
      label: "SALDO TERSEDIA",
      value: rp(available),
      caption: "Dapat ditarik ke rekening terverifikasi",
    },
    {
      label: "DITAHAN ESCROW",
      value: rp(escrow),
      caption: `${escrowSessions} sesi belum berakhir`,
    },
    {
      label: "TOTAL PENDAPATAN",
      value: rp(total),
      caption: "Akumulasi dari sesi selesai",
    },
  ];

  return (
    <>
      <AccountHeader
        title="Dompet & Pencairan"
        subtitle="Kelola pendapatan sesi mengajar dan pencairan ke rekening tujuan."
        userName={user?.fullName || "Mentor"}
        userRole="Mentor"
        avatarUrl={user?.avatarUrl ?? "/avatar-default.svg"}
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-8 py-6">
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
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900">
                {m.value}
              </span>
              <span className="text-xs text-neutral-500">{m.caption}</span>
            </div>
          ))}
        </div>

        {/* 2-Column Content: Activity + Payout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left: Aktivitas Dompet */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-base font-bold tracking-tight text-neutral-900">
                    Riwayat mutasi dompet
                  </h2>
                  <span className="text-xs text-neutral-500">
                    Pemasukan dari sesi selesai dan penarikan ke rekening
                  </span>
                </div>
                <span className="text-xs font-medium text-neutral-400">
                  {entries.length} mutasi
                </span>
              </div>

              {loading ? (
                <p className="px-6 py-8 text-xs text-neutral-400">
                  Memuat aktivitas dompet…
                </p>
              ) : entries.length === 0 ? (
                <p className="px-6 py-8 text-xs text-neutral-500">
                  Belum ada aktivitas dompet.
                </p>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {entries.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                          a.type === "in"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {a.type === "in" ? (
                          <ArrowDownLeft size={17} strokeWidth={2} />
                        ) : (
                          <ArrowUpRight size={17} strokeWidth={2} />
                        )}
                      </span>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-sm font-bold text-neutral-900">
                          {a.description}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {dateFmt(a.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-extrabold ${
                          a.type === "in"
                            ? "text-brand-700"
                            : "text-neutral-900"
                        }`}
                      >
                        {rpSigned(a.amount, a.type)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700">
                <Info size={17} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="text-xs leading-relaxed text-neutral-700">
                Dana dari sesi mengajar otomatis dilepas dari escrow ke saldo
                tersedia setelah jadwal sesi berakhir.
              </span>
            </div>
          </div>

          {/* Right: Pencairan */}
          <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Rekening pencairan
              </h3>
              {primaryAccount && (
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="text-xs font-bold text-brand-700 transition hover:text-brand-800 hover:underline"
                >
                  Ubah
                </button>
              )}
            </div>

            <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Building2 size={19} strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                {primaryAccount ? (
                  <>
                    <span className="truncate text-sm font-bold text-neutral-900">
                      {primaryAccount.bankName} ••••{" "}
                      {primaryAccount.accountNumber.slice(-4)}
                    </span>
                    <span className="truncate text-xs text-neutral-500">
                      a.n. {primaryAccount.accountName}
                      {primaryAccount.isVerified ? " • Terverifikasi" : ""}
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-neutral-500">
                      Belum ada rekening tujuan
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
                    >
                      <Plus size={13} strokeWidth={2.5} /> Tambah Rekening Bank
                    </button>
                  </div>
                )}
              </div>
            </div>

            <PayoutButton
              availableBalance={available}
              accountId={primaryAccount?.id ?? null}
              onSuccess={loadData}
            />

            <div className="border-t border-neutral-100 pt-3">
              <p className="text-xs font-bold text-neutral-900">
                Tanpa minimum pencairan
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                Transfer ke rekening bank terverifikasi tanpa potongan biaya
                admin tambahan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah/Ubah Rekening Bank */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <CreditCard size={17} />
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  {primaryAccount ? "Ubah Rekening Bank" : "Tambah Rekening Bank"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitAccount} className="flex flex-col gap-4 p-6">
              {modalError && (
                <div className="rounded-xl border border-danger-200 bg-danger-50 p-3 text-xs font-medium text-danger-700">
                  {modalError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Pilih Bank
                </label>
                <select
                  value={formBank}
                  onChange={(e) => setFormBank(e.target.value)}
                  className="h-11 rounded-xl border border-neutral-300 bg-white px-3.5 text-sm font-medium text-neutral-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                >
                  {BANK_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 8210948123"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value.replace(/\D/g, ""))}
                  className="h-11 rounded-xl border border-neutral-300 bg-white px-3.5 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                  required
                />
                <span className="text-[11px] text-neutral-400">
                  Hanya angka tanpa spasi atau simbol.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  placeholder="Nama sesuai buku tabungan"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-11 rounded-xl border border-neutral-300 bg-white px-3.5 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
                  required
                />
                <span className="text-[11px] text-neutral-400">
                  Pastikan nama sama dengan buku tabungan untuk pencairan otomatis.
                </span>
              </div>

              <div className="mt-2 flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="h-10 rounded-xl px-4 text-xs font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-xs font-bold text-white transition hover:bg-brand-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-brand-500/50"
                >
                  {submitting ? "Menyimpan…" : "Simpan Rekening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
