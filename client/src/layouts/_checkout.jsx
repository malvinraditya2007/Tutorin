import * as React from "react";
import { Outlet } from "react-router-dom";

export default function CheckoutLayout({ children }) {
  return <div className="flex min-h-full flex-col bg-cream">{children ?? <Outlet />}</div>;
}
