import * as React from "react";
import { cn } from "@/lib/utils";
/**
 * FormField — input teks berlabel dengan ikon opsional dan teks bantuan/error.
 *
 * Mengikuti Figma node 1:5529: label tebal, input setinggi 56px dengan radius 14px,
 * border cream, slot ikon kiri, dan teks bantuan redup di bawah.
 *
 * @example
 * <FormField
 *   label="Email kampus atau email"
 *   leftIcon={<Mail className="size-[18px] text-brand-650" />}
 *   placeholder="arif.pratama@ui.ac.id"
 *   helperText="Pastikan email ini masih bisa kamu akses."
 * />
 */
export const FormField = React.forwardRef(({ className, label, helperText, error, leftIcon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedById = `${inputId}-desc`;
    const message = error ?? helperText;
    return (<div className="flex w-full flex-col gap-2">
        {label && (<label htmlFor={inputId} className="mb-0.5 block text-xs font-medium leading-none text-neutral-700">
            {label}
          </label>)}
        <div className={cn("flex h-11 items-center gap-2.5 rounded-lg border bg-white px-3.5 transition focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/10", error ? "border-danger-500" : "border-neutral-300", className)}>
          {leftIcon && (<span className="inline-flex shrink-0 text-brand-650">
              {leftIcon}
            </span>)}
          <input ref={ref} id={inputId} aria-invalid={error ? true : undefined} aria-describedby={message ? describedById : undefined} className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted" {...props}/>
        </div>
        {message && (<p id={describedById} className={cn("text-[10px] leading-normal", error ? "text-danger-600" : "text-ink-muted")}>
            {message}
          </p>)}
      </div>);
});
FormField.displayName = "FormField";
