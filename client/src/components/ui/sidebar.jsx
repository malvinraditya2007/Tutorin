import * as React from "react";
import Link from "@/lib/link";
import { usePathname } from "@/lib/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth-actions";
import { Logo } from "./logo";
export function Sidebar({ roleLabel, items, activeHref, userName, userBadge, avatarUrl, footerItem, className, ...props }) {
    const pathname = usePathname();
    const resolvedActive = activeHref ?? items.find((i) => pathname.startsWith(i.href))?.href ?? "";
    const isDefaultAvatar = !avatarUrl || avatarUrl === "/avatar-default.svg";
    const initials = (userName ?? "User")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("");
    return (<aside className={cn("w-[248px] shrink-0 border-r border-neutral-200/80 bg-white", className)} {...props}>
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Brand Header */}
        <div className="flex items-center border-b border-neutral-100 px-5 py-5">
          <Link href="/" className="inline-flex items-center">
            <Logo size="sm" tone="dark"/>
          </Link>
        </div>

        {/* User Profile Card inside Sidebar */}
        {userName && (<div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
            {isDefaultAvatar ? (<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-extrabold tracking-tight text-brand-700">
                {initials}
              </div>) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={avatarUrl} alt={userName} className="size-10 shrink-0 rounded-full object-cover"/>)}
            <div className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm font-bold leading-tight text-neutral-900">
                {userName}
              </span>
              {userBadge && (<span className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-600">
                  {userBadge}
                </span>)}
            </div>
          </div>)}

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3 py-4" aria-label={roleLabel}>
          {items.map((item) => {
            const isActive = item.href === resolvedActive;
            return (<Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className={cn("flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm transition duration-150", isActive
                    ? "bg-brand-50 font-bold text-neutral-900"
                    : "font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900")}>
                <span className={cn("inline-flex shrink-0", isActive ? "text-brand-600" : "text-neutral-500")} aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>);
        })}
        </nav>

        {/* Bottom Logout / Footer Action */}
        <div className="mt-auto border-t border-neutral-100 px-3 py-4">
          {footerItem ? (<Link href={footerItem.href} aria-current={footerItem.href === resolvedActive ? "page" : undefined} className={cn("flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm transition duration-150", footerItem.href === resolvedActive
                ? "bg-brand-50 font-bold text-neutral-900"
                : "font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900")}>
              <span className="inline-flex shrink-0" aria-hidden="true">
                {footerItem.icon}
              </span>
            </Link>) : (
              <button
                type="button"
                onClick={logout}
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-rose-600 transition duration-150 hover:bg-rose-50"
              >
                <LogOut size={18} strokeWidth={2} aria-hidden="true" />
                Keluar
              </button>
            )}
        </div>
      </div>
    </aside>);
}
