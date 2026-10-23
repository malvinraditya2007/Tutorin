import * as React from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  WalletCards,
  UserRound,
} from "lucide-react";
import { Sidebar } from "@/components/ui";
import { useAuth } from "@/auth/auth";

const MENTOR_NAV = [
  { label: "Beranda", href: "/mentor/dashboard", icon: <LayoutDashboard className="size-[18px]" /> },
  { label: "Kelola Kalender", href: "/mentor/kalender", icon: <CalendarDays className="size-[18px]" /> },
  { label: "Dompet", href: "/mentor/dompet", icon: <WalletCards className="size-[18px]" /> },
  { label: "Profil Mentor", href: "/mentor/profil", icon: <UserRound className="size-[18px]" /> },
];

export default function MentorLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar
        roleLabel="Ruang mentor"
        title="Kelola aktivitas"
        items={MENTOR_NAV}
        userName={user?.fullName}
        userBadge={user?.campus ? `MENTOR • ${user.campus}` : "MENTOR"}
        avatarUrl={user?.avatarUrl}
      />
      <div className="flex min-w-0 flex-1 flex-col">{children ?? <Outlet />}</div>
    </div>
  );
}
