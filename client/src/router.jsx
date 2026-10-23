import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute, useAuth, homeForRole } from "@/auth/auth";

// Layouts
import PublicLayout from "@/layouts/_public";
import LegalLayout from "@/layouts/_legal";
import AuthLayout from "@/layouts/_auth";
import BrowseLayout from "@/layouts/_browse";
import CheckoutLayout from "@/layouts/_checkout";
import MahasiswaLayout from "@/layouts/_mahasiswa";
import MentorLayout from "@/layouts/_mentor";

// Public & Legal Pages
import HomePage from "@/pages/Home";
import JadiMentorPage from "@/pages/JadiMentor";
import TutorDetailPage from "@/pages/TutorDetail";
import SyaratPage from "@/pages/Syarat";
import PrivasiPage from "@/pages/Privasi";

// Auth Pages
import LoginPage from "@/pages/auth/Login";
import DaftarPage from "@/pages/auth/Daftar";
import LupaPasswordPage from "@/pages/auth/LupaPassword";
import OnboardingProfilPage from "@/pages/auth/OnboardingProfil";
import OnboardingMataKuliahPage from "@/pages/auth/OnboardingMataKuliah";

// Browse Pages
import CariTutorPage from "@/pages/browse/CariTutor";
import HasilKosongPage from "@/pages/browse/HasilKosong";

// Checkout Pages
import CheckoutPage from "@/pages/checkout/Checkout";
import KonfirmasiPage from "@/pages/checkout/Konfirmasi";

// Mahasiswa Pages
import DashboardMahasiswaPage from "@/pages/mahasiswa/DashboardMahasiswa";
import NotifikasiMahasiswaPage from "@/pages/mahasiswa/Notifikasi";
import UlasanMahasiswaPage from "@/pages/mahasiswa/Ulasan";

// Mentor Pages
import DashboardMentorPage from "@/pages/mentor/DashboardMentor";
import DompetPage from "@/pages/mentor/Dompet";
import KalenderPage from "@/pages/mentor/Kalender";
import ProfilMentorPage from "@/pages/mentor/ProfilMentor";

/** Dispatcher pasca-login bila URL /post-login dipanggil langsung. */
function PostLoginDispatcher() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? homeForRole(user.role) : "/login"} replace />;
}

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/jadi-mentor", element: <JadiMentorPage /> },
      { path: "/tutor/:id", element: <TutorDetailPage /> },
    ],
  },

  // Legal routes
  {
    element: <LegalLayout />,
    children: [
      { path: "/syarat", element: <SyaratPage /> },
      { path: "/privasi", element: <PrivasiPage /> },
    ],
  },

  // Auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/daftar", element: <DaftarPage /> },
      { path: "/lupa-password", element: <LupaPasswordPage /> },
      { path: "/onboarding-mentor/profil", element: <OnboardingProfilPage /> },
      { path: "/onboarding-mentor/mata-kuliah", element: <OnboardingMataKuliahPage /> },
    ],
  },

  // Browse routes
  {
    element: <BrowseLayout />,
    children: [
      { path: "/cari-tutor", element: <CariTutorPage /> },
      { path: "/cari-tutor/kosong", element: <HasilKosongPage /> },
    ],
  },

  // Checkout routes (Protected: requires logged in user)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <CheckoutLayout />,
        children: [
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/konfirmasi", element: <KonfirmasiPage /> },
        ],
      },
    ],
  },

  // Mahasiswa routes (Protected: requires role="mahasiswa")
  {
    element: <ProtectedRoute role="mahasiswa" />,
    children: [
      {
        element: <MahasiswaLayout />,
        children: [
          { path: "/mahasiswa/dashboard", element: <DashboardMahasiswaPage /> },
          { path: "/mahasiswa/notifikasi", element: <NotifikasiMahasiswaPage /> },
          { path: "/mahasiswa/ulasan", element: <UlasanMahasiswaPage /> },
        ],
      },
    ],
  },

  // Mentor routes (Protected: requires role="mentor")
  {
    element: <ProtectedRoute role="mentor" />,
    children: [
      {
        element: <MentorLayout />,
        children: [
          { path: "/mentor/dashboard", element: <DashboardMentorPage /> },
          { path: "/mentor/dompet", element: <DompetPage /> },
          { path: "/mentor/kalender", element: <KalenderPage /> },
          { path: "/mentor/profil", element: <ProfilMentorPage /> },
        ],
      },
    ],
  },

  // Post login helper
  {
    path: "/post-login",
    element: <PostLoginDispatcher />,
  },

  // Fallback 404
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
