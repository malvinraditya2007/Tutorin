import { api } from "./api.js";

/** Keluar dari sesi lalu kembali ke beranda (dipakai sebagai form action di Sidebar). */
export async function logout() {
  try {
    await api.post("/auth/logout");
  } finally {
    window.location.href = "/";
  }
}
