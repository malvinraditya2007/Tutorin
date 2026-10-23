import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
/**
 * FaqItem — baris pertanyaan/jawaban yang bisa dibuka-tutup.
 *
 * Kartu putih dengan border netral yang SERAGAM di state terbuka maupun
 * tertutup (tidak berubah warna aksen saat terbuka), toggle plus/minus netral,
 * agar konsisten di seluruh daftar FAQ.
 *
 * Bisa uncontrolled (`defaultOpen`) atau controlled (`open` + `onToggle`).
 *
 * @example
 * <FaqItem
 *   question="Apa yang terjadi setelah saya memilih slot?"
 *   answer="Pembayaran kamu ditahan di escrow sampai sesi selesai."
 * />
 */
export function FaqItem({ question, answer, defaultOpen = false, open: controlledOpen, onToggle, className, ...props }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen != null;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const answerId = React.useId();
    const handleToggle = () => {
        const next = !open;
        if (!isControlled)
            setUncontrolledOpen(next);
        onToggle?.(next);
    };
    return (<div className={cn("flex w-full flex-col gap-3 rounded-xl border border-neutral-200/80 bg-white p-5 transition-colors hover:border-neutral-300", className)} {...props}>
      <button type="button" onClick={handleToggle} aria-expanded={open} aria-controls={answerId} className="flex items-center justify-between gap-4 text-left">
        <span className="text-base font-medium tracking-tight text-neutral-900">{question}</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 transition" aria-hidden="true">
          {open ? <Minus size={16} strokeWidth={1.75}/> : <Plus size={16} strokeWidth={1.75}/>}
        </span>
      </button>
      {open && (<p id={answerId} className="text-sm leading-relaxed text-neutral-600">
          {answer}
        </p>)}
    </div>);
}
