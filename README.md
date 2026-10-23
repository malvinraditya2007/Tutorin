# Tutorin

Tutorin adalah platform peer tutoring komersial 1-on-1 berbasis web yang menghubungkan mahasiswa yang membutuhkan bimbingan akademik (**Mentee**) dengan mahasiswa atau alumni berprestasi (**Mentor**).

Sesi mentoring dan koordinasi dilakukan melalui **Discord**. Pembayaran dikelola lewat sistem **escrow** (saat ini masih berupa **simulasi**).

## Tujuan
- Mempertemukan mentee dan mentor secara aman dan transparan.
- Menjamin pembayaran lewat escrow (dana baru diteruskan ke mentor setelah sesi selesai).
- Memberi mentor penghasilan, dan platform mendapat pendapatan dari komisi.

## Model Bisnis
| Aspek | Ketentuan |
|---|---|
| Model harga | Tarif per jam, ditentukan oleh mentor; durasi 60 menit |
| Pembagian pendapatan | Biaya layanan **8%** ditambahkan di atas tarif dan ditanggung mahasiswa. Mentor menerima tarif **penuh**; biaya layanan menjadi pendapatan platform |
| Contoh | Tarif Rp65.000 → biaya layanan Rp5.200 → mahasiswa bayar Rp70.200, mentor terima Rp65.000 |
| Sistem pembayaran | Escrow/holding (saat ini masih **simulasi** / mock); dana masuk saldo mentor setelah sesi dinyatakan selesai |
| Media sesi | Discord (link undangan diatur per mentor) |

> [!NOTE]
> **Catatan Escrow & Pembayaran**: Sistem transaksi dan escrow pada platform saat ini masih berstatus **simulasi (mock/dummy)** untuk keperluan pengembangan dan prototipe, serta belum terintegrasi dengan payment gateway riil.

## Peran Pengguna
| Peran | Deskripsi | Akses |
|---|---|---|
| **Pengunjung** | Belum login | Halaman publik, cari tutor, lihat profil tutor |
| **Mentee (Mahasiswa)** | Pencari bimbingan | Booking, bayar, jadwal, ulasan, riwayat transaksi |
| **Mentor** | Pemberi bimbingan | Onboarding, kalender & ketersediaan slot, dompet & pencairan |

## Tech Stack
- **Frontend**: React 19 + React Router 7 + Vite + Tailwind CSS v4 (100% JavaScript)
- **Backend**: Express.js 4 + Raw SQL via `mysql2` (100% JavaScript ESM, tanpa ORM)
- **Database**: MySQL 8.x (Cloud via TiDB Cloud Serverless / Lokal via XAMPP)
- **Autentikasi**: Email + Password (`bcryptjs`), JWT Token via `httpOnly` cookie
- **Validasi**: Zod

## Konfigurasi Lingkungan (`.env`)

Di dalam folder `server/`, buat atau perbarui file `.env` (lihat referensi di [server/.env.example](server/.env.example)):

```env
# Koneksi Cloud MySQL (TiDB Cloud / Railway / Aiven)
DATABASE_URL="mysql://<user>:<password>@<host>:<port>/<dbname>?ssl=true"

# Atau jika menggunakan MySQL lokal (XAMPP):
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=tutorin_db
# DB_SSL=false

AUTH_SECRET="XfrrtPc6c0rkUzYwOOzFC1vyM09vLbqAC2fagWK/hEQ="
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

## Menjalankan Aplikasi

1. **Install Dependensi:**
   ```bash
   npm install       # Otomatis menginstall packages untuk root, server, dan client
   ```

2. **Inisialisasi Database (Pertama Kali):**
   ```bash
   npm run db:init   # Membuat semua tabel skema MySQL
   npm run seed      # Mengisi data awal mentor, mata kuliah, slot & ulasan
   ```

3. **Jalankan Aplikasi (Server API + Frontend Web):**
   ```bash
   npm run dev
   ```
   Perintah ini akan menjalankan kedua service sekaligus:
   - **Frontend (React + Vite)**: [http://localhost:5173](http://localhost:5173)
   - **Backend API (Express)**: [http://localhost:4000](http://localhost:4000)

4. **Perintah Terpisah (Opsional):**
   ```bash
   npm run dev:server  # Jalankan Express API saja
   npm run dev:client  # Jalankan React Vite saja
   npm run build       # Build bundle frontend
   ```

## Akun Demo (hasil seed)
| Peran | Email | Password | Catatan & Hak Akses |
|---|---|---|---|
| **Mahasiswa** | `malvin@kampus.ac.id` | `password123` | Akses area `/mahasiswa/*`. Memiliki 2 sesi **selesai** (Kalkulus & Statistika) yang siap diberi ulasan di `/mahasiswa/ulasan`. |
| **Mahasiswa** | `arif.pratama@ui.ac.id` | `password123` | Akun mahasiswa pembuat riwayat ulasan awal. |
| **Mentor** | `alya.prameswari@kampus.ac.id` | `password123` | Akses area `/mentor/*`. Mentor unggulan (ITB, rating 4.9) dengan profil lengkap, slot kalender, saldo dompet siap dicairkan. |

## Struktur Direktori
```text
tutorin/
├── client/                      # Frontend (React 19 + Vite + Tailwind v4)
│   ├── src/
│   │   ├── auth/                # AuthProvider, useAuth, ProtectedRoute
│   │   ├── components/ui/       # Komponen UI
│   │   ├── layouts/             # Route layout (public, auth, browse, dashboard, legal)
│   │   ├── lib/                 # API client, link, money, datetime utils
│   │   ├── pages/               # Halaman aplikasi
│   │   └── router.jsx           # React Router 7 configuration
│   └── vite.config.js           # Vite dev server + API proxy
│
├── server/                      # Backend API (Express.js)
│   ├── src/
│   │   ├── database/            # schema.sql, init.js (DDL), seed.js (data awal)
│   │   ├── lib/                 # db.js (MySQL pool & transaksi), fees, roles, tutors, bookings
│   │   ├── middleware/auth.js   # JWT verification & role authorization
│   │   ├── routes/              # auth, public, api routes
│   │   ├── services/            # Logika bisnis (escrow, booking, payment, wallet, review, dll)
│   │   └── index.js             # Express server entry point (port 4000)
│   └── .env.example             # Contoh konfigurasi env MySQL
│
└── package.json                 # Monorepo runner (scripts dev, db:init, seed, build)
```
