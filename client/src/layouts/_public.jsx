import * as React from "react";
import { Outlet } from "react-router-dom";
import { usePathname } from "@/lib/navigation";
import { Navbar } from "@/components/ui";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Jadi Mentor", href: "/jadi-mentor" },
];

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const activeHref =
    pathname === "/"
      ? "/"
      : NAV_ITEMS.find((i) => i.href !== "/" && pathname.startsWith(i.href))?.href ?? "/";

  return (
    <div className="flex min-h-full flex-col bg-cream">
      <Navbar items={NAV_ITEMS} activeHref={activeHref} />
      <main className="flex-1">{children ?? <Outlet />}</main>
    </div>
  );
}
