import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Gabungkan class Tailwind dengan aman, menyelesaikan konflik.
 * Memadukan clsx (class kondisional) dengan tailwind-merge (dedupe/override).
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
