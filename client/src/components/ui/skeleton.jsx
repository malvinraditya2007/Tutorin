import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Komponen Skeleton untuk placeholder loading shimmer yang halus.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-neutral-200/80", className)}
      {...props}
    />
  );
}

/**
 * Skeleton placeholder untuk TutorCard pada halaman Cari Tutor
 */
export function TutorCardSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5">
      <div className="flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <Skeleton className="size-12 rounded-full shrink-0" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-lg shrink-0" />
        </div>
        <div className="flex flex-col gap-1.5 pt-1">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-100 pt-3.5">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}

