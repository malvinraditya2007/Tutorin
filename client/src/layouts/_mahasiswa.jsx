import * as React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, STUDENT_NAV, STUDENT_SIDEBAR } from "@/components/ui";
import { useAuth } from "@/auth/auth";

export default function MahasiswaLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar
        roleLabel={STUDENT_SIDEBAR.roleLabel}
        title={STUDENT_SIDEBAR.title}
        items={STUDENT_NAV}
        userName={user?.fullName}
        userBadge={user?.campus ? `MAHASISWA • ${user.campus}` : "MAHASISWA"}
        avatarUrl={user?.avatarUrl}
      />
      <div className="flex min-w-0 flex-1 flex-col">{children ?? <Outlet />}</div>
    </div>
  );
}
