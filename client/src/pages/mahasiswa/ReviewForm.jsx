import * as React from "react";
import { Star, Check, Send } from "lucide-react";
import { api } from "@/lib/api";

const RATING_LABELS = ["", "Kurang puas", "Cukup", "Baik", "Sangat membantu", "Luar biasa!"];

export function ReviewForm({
  bookingId,
  highlights,
  onSuccess,
}) {
  const [rating, setRating] = React.useState(5);
  const [hover, setHover] = React.useState(0);
  const [selected, setSelected] = React.useState([]);
  const [comment, setComment] = React.useState("");
  const [anonymous, setAnonymous] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const shown = hover || rating;
  const toggle = (h) =>
    setSelected((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/reviews", {
        bookingId,
        rating,
        highlights: selected,
        comment,
        isAnonymous: anonymous,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Gagal mengirim ulasan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-1 flex-col gap-6 rounded-2xl border border-neutral-200/80 bg-white p-6"
    >
      {error && (
        <div className="rounded-xl border border-danger-500/30 bg-danger-50 p-3 text-xs font-bold text-danger-600">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="flex flex-col gap-2.5 border-b border-neutral-100 pb-5">
        <span className="text-xs font-bold text-neutral-900">
          Penilaian sesi belajar
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${n} bintang`}
                className="rounded-lg p-1 transition hover:bg-amber-50 active:scale-[0.92]"
              >
                <Star
                  className={`size-7 transition-colors ${
                    n <= shown
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-200"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
            {shown}.0 • {RATING_LABELS[shown]}
          </span>
        </div>
      </div>

      {/* Highlights */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900">
            Apa yang paling berkesan dari tutor ini?
          </span>
          <span className="text-[11px] font-medium text-neutral-400">
            Pilih beberapa
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {highlights.map((h) => {
            const active = selected.includes(h);
            return (
              <button
                key={h}
                type="button"
                onClick={() => toggle(h)}
                aria-pressed={active}
                className={`flex h-9 items-center gap-1.5 rounded-xl border px-3.5 text-xs font-bold transition duration-150 active:scale-[0.98] ${
                  active
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-neutral-200/90 bg-neutral-50/60 text-neutral-600 hover:border-neutral-300 hover:bg-white hover:text-neutral-900"
                }`}
              >
                {active && (
                  <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                )}
                {h}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comment */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="review-comment"
          className="text-xs font-bold text-neutral-900"
        >
          Ceritakan pengalamanmu (opsional)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Contoh: Kakaknya sabar banget jelasin konsep turunan parsial sampai ngerti..."
          className="resize-none rounded-xl border border-neutral-200/90 bg-neutral-50/40 px-3.5 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-600/10"
        />
      </div>

      {/* Footer: Anonymous + Submit */}
      <div className="mt-auto flex flex-col justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center">
        <label className="flex cursor-pointer items-center gap-2.5 text-left text-xs font-semibold text-neutral-600 select-none">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <span
            className={`flex size-[18px] items-center justify-center rounded-md border transition ${
              anonymous
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-neutral-300 bg-white"
            }`}
          >
            {anonymous && (
              <Check size={12} strokeWidth={2.5} aria-hidden="true" />
            )}
          </span>
          Sembunyikan namaku (ulasan anonim)
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-xs font-bold text-white transition duration-150 hover:bg-brand-600 active:scale-[0.98] disabled:opacity-50"
        >
          <Send size={13} strokeWidth={2.2} aria-hidden="true" />
          {loading ? "Mengirim..." : "Kirim ulasan"}
        </button>
      </div>
    </form>
  );
}
