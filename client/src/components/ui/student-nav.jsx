import * as React from "react";
import { LayoutDashboard, Search, Bell, Star, } from "lucide-react";
export const STUDENT_NAV = [
    { label: "Beranda", href: "/mahasiswa/dashboard", icon: <LayoutDashboard className="size-[18px]"/> },
    { label: "Cari Tutor", href: "/cari-tutor", icon: <Search className="size-[18px]"/> },
    { label: "Notifikasi", href: "/mahasiswa/notifikasi", icon: <Bell className="size-[18px]"/> },
    { label: "Ulasan", href: "/mahasiswa/ulasan", icon: <Star className="size-[18px]"/> },
];
export const STUDENT_SIDEBAR = {
    roleLabel: "Ruang mahasiswa",
    title: "Belajar bersama",
};
