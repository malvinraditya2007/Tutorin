/**
 * Klien API kecil. Cookie sesi httpOnly dikirim otomatis (same-origin via
 * proxy Vite saat dev). Request GET di-retry sekali bila server gagal
 * menjangkau database Neon yang baru bangun dari idle (HTTP 500).
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(method, path, body, attempt = 0) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "include",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 500 && method === "GET" && attempt < 1) {
    await sleep(1500);
    return request(method, path, body, attempt + 1);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // body kosong
  }
  if (!res.ok) {
    throw new ApiError(data?.error ?? "Terjadi kesalahan.", res.status);
  }
  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body = {}) => request("POST", path, body),
  put: (path, body = {}) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};
