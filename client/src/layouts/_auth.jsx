import * as React from "react";
import { Outlet } from "react-router-dom";
import { HeaderAuth } from "@/components/ui";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-full flex-col bg-cream">
      <HeaderAuth />
      <main className="flex flex-1 flex-col">{children ?? <Outlet />}</main>
    </div>
  );
}
