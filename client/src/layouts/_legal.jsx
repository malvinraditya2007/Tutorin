import * as React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/ui";

export default function LegalLayout({ children }) {
  return (
    <div className="flex min-h-full flex-col bg-cream">
      <div className="flex-1">{children ?? <Outlet />}</div>
      <Footer />
    </div>
  );
}
