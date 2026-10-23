import crypto from "crypto";
import bcrypt from "bcryptjs";
import { db } from "../lib/db.js";

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

const SUBJECTS = [
  { name: "Kalkulus", slug: "kalkulus", icon: "Sigma" },
  { name: "Statistika", slug: "statistika", icon: "BarChart3" },
  { name: "Pemrograman", slug: "pemrograman", icon: "Code" },
  { name: "Akuntansi", slug: "akuntansi", icon: "Calculator" },
  { name: "Fisika Dasar", slug: "fisika-dasar", icon: "FlaskConical" },
  { name: "Bahasa Inggris", slug: "bahasa-inggris", icon: "Languages" },
  { name: "Struktur Data", slug: "struktur-data", icon: "Code" },
  { name: "Aljabar Linear", slug: "aljabar-linear", icon: "Sigma" },
];

const HIGHLIGHTS = [
  "Penjelasan jelas",
  "Sabar & ramah",
  "Tepat waktu",
  "Materi terstruktur",
  "Responsif di chat",
  "Banyak latihan soal",
];

const MENTORS = [
  {
    name: "Alya Prameswari", program: "Teknik Industri", campus: "ITB", semester: 7,
    rate: 65000, rating: 4.9, reviews: 126, sessions: 156, photo: "/figma-assets/tutor-1.png",
    headline: "Kita uraikan konsepnya pelan-pelan, lalu latihan sampai kamu bisa menjelaskan balik.",
    bio: "Halo! Aku mahasiswa Teknik Industri yang suka membuat matematika terasa lebih dekat dengan situasi sehari-hari. Selama tiga tahun terakhir aku mendampingi teman seangkatan dan adik tingkat memahami Kalkulus, Aljabar Linear, dan Matematika Teknik—bukan sekadar menghafal rumus.",
    subjects: ["Kalkulus", "Aljabar Linear", "Statistika"],
    featured: true,
  },
  {
    name: "Raka Mahendra", program: "Ilmu Komputer", campus: "UI", semester: 6,
    rate: 75000, rating: 5.0, reviews: 98, sessions: 110, photo: "/figma-assets/tutor-2.png",
    headline: "Ngoding itu soal pola pikir. Aku bantu kamu paham logikanya, bukan hafal sintaks.",
    bio: "Mahasiswa Ilmu Komputer yang suka menyederhanakan konsep algoritma lewat analogi sehari-hari. Fokus di Python, struktur data, dan persiapan technical interview.",
    subjects: ["Pemrograman", "Struktur Data"],
    featured: false,
  },
  {
    name: "Nadira Putri", program: "Akuntansi", campus: "UGM", semester: 7,
    rate: 55000, rating: 4.8, reviews: 84, sessions: 92, photo: "/figma-assets/tutor-3.png",
    headline: "Laporan keuangan jadi masuk akal kalau tahu alur ceritanya.",
    bio: "Suka membantu teman memahami akuntansi keuangan dari dasar sampai analisis laporan. Banyak latihan soal dan studi kasus nyata.",
    subjects: ["Akuntansi"],
    featured: false,
  },
  {
    name: "Gilang Saputra", program: "Teknik Mesin", campus: "ITS", semester: 8,
    rate: 60000, rating: 4.9, reviews: 73, sessions: 80, photo: "/figma-assets/tutor-4.png",
    headline: "Fisika itu intuitif kalau kita mulai dari fenomena, bukan rumus.",
    bio: "Mendampingi mahasiswa memahami fisika dasar dan termodinamika dengan pendekatan konseptual sebelum masuk ke perhitungan.",
    subjects: ["Fisika Dasar"],
    featured: false,
  },
  {
    name: "Salsabila Hana", program: "Statistika", campus: "IPB", semester: 6,
    rate: 50000, rating: 4.7, reviews: 61, sessions: 68, photo: "/figma-assets/tutor-alya.png",
    headline: "Statistika bukan soal angka, tapi soal keputusan.",
    bio: "Fokus di statistika dan probabilitas untuk mahasiswa yang baru mulai. Sabar dan suka memberi contoh terapan.",
    subjects: ["Statistika"],
    featured: false,
  },
  {
    name: "Fajar Nugroho", program: "Teknik Elektro", campus: "UGM", semester: 7,
    rate: 70000, rating: 4.8, reviews: 90, sessions: 101, photo: "/figma-assets/tutor-2.png",
    headline: "Satu konsep sekaligus, sampai benar-benar nyantol.",
    bio: "Membantu Kalkulus dan Aljabar Linear dengan banyak latihan terstruktur dan peta konsep sebelum ujian.",
    subjects: ["Kalkulus", "Aljabar Linear"],
    featured: false,
  },
  {
    name: "Keisya Maharani", program: "Sastra Inggris", campus: "UI", semester: 6,
    rate: 45000, rating: 4.9, reviews: 112, sessions: 130, photo: "/figma-assets/tutor-1.png",
    headline: "Academic writing dan speaking jadi jauh lebih natural tanpa takut salah grammar.",
    bio: "Berpengalaman membimbing mahasiswa menulis essay akademik, persiapan presentasi bahasa Inggris, dan TOEFL/IELTS prep dengan cara santai tapi terarah.",
    subjects: ["Bahasa Inggris"],
    featured: false,
  },
  {
    name: "Bima Arya Pratama", program: "Teknik Informatika", campus: "ITB", semester: 8,
    rate: 85000, rating: 5.0, reviews: 145, sessions: 170, photo: "/figma-assets/tutor-2.png",
    headline: "Dari pointer sampai graph & dynamic programming, kita bedah bareng step-by-step.",
    bio: "Asisten laboratorium Algoritma & Struktur Data selama 4 semester. Suka membantu mahasiswa tingkat 1 dan 2 yang kesulitan di tugas pemrograman maupun praktikum.",
    subjects: ["Struktur Data", "Pemrograman"],
    featured: false,
  },
];

const SAMPLE_REVIEWS = [
  { reviewer: "Dimas Rahardian", subjectName: "Kalkulus", rating: 5, comment: "Penjelasannya runtut dan sabar. Materi integral yang tadinya pusing jadi masuk akal.", highlights: ["Penjelasan jelas", "Sabar & ramah"] },
  { reviewer: "Sinta Permata", subjectName: "Aljabar Linear", rating: 5, comment: "Dikasih peta konsep sebelum sesi, jadi belajarnya terarah. Recommended!", highlights: ["Materi terstruktur", "Tepat waktu"] },
  { reviewer: "Bagus Wicaksono", subjectName: "Statistika", rating: 4, comment: "Fleksibel soal jadwal dan responsif di chat. Nilai UTS naik signifikan.", highlights: ["Responsif di chat", "Banyak latihan soal"] },
];

function emailFrom(name) {
  return name.toLowerCase().replace(/\s+/g, ".") + "@kampus.ac.id";
}

function formatDate(d) {
  return d.toISOString().slice(0, 19).replace("T", " ");
}

async function seed() {
  console.log("Memulai proses seeding database MySQL...");
  const defaultPasswordHash = await hashPassword("password123");

  // 1. Subjects
  const subjectByName = new Map();
  for (const s of SUBJECTS) {
    const [rows] = await db.query("SELECT id FROM subjects WHERE slug = ?", [s.slug]);
    let id;
    if (rows.length > 0) {
      id = rows[0].id;
      await db.query("UPDATE subjects SET name = ?, icon = ? WHERE id = ?", [s.name, s.icon, id]);
    } else {
      id = crypto.randomUUID();
      await db.query("INSERT INTO subjects (id, name, slug, icon) VALUES (?, ?, ?, ?)", [id, s.name, s.slug, s.icon]);
    }
    subjectByName.set(s.name, id);
  }

  // 2. Highlights
  const highlightByLabel = new Map();
  for (const label of HIGHLIGHTS) {
    const [rows] = await db.query("SELECT id FROM highlight_tags WHERE label = ?", [label]);
    let id;
    if (rows.length > 0) {
      id = rows[0].id;
    } else {
      id = crypto.randomUUID();
      await db.query("INSERT INTO highlight_tags (id, label) VALUES (?, ?)", [id, label]);
    }
    highlightByLabel.set(label, id);
  }

  // 3. Mahasiswa contoh (Arif Pratama)
  let studentId;
  const [studentRows] = await db.query("SELECT id FROM users WHERE email = ?", ["arif.pratama@ui.ac.id"]);
  if (studentRows.length > 0) {
    studentId = studentRows[0].id;
  } else {
    studentId = crypto.randomUUID();
    await db.query(
      `INSERT INTO users (id, role, full_name, email, password_hash, campus) VALUES (?, 'mahasiswa', ?, ?, ?, ?)`,
      [studentId, "Arif Pratama", "arif.pratama@ui.ac.id", defaultPasswordHash, "UI"]
    );
  }

  // 4. Mentor + Profil + Subjects + Wallet + Slots
  let featuredMentorId = null;
  let rakaMentorId = null;
  let gilangMentorId = null;

  for (const m of MENTORS) {
    const email = emailFrom(m.name);
    let userId;
    const [userRows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (userRows.length > 0) {
      userId = userRows[0].id;
      await db.query(
        "UPDATE users SET password_hash = ?, avatar_url = ? WHERE id = ?",
        [defaultPasswordHash, m.photo, userId]
      );
    } else {
      userId = crypto.randomUUID();
      await db.query(
        `INSERT INTO users (id, role, full_name, email, password_hash, campus, avatar_url) VALUES (?, 'mentor', ?, ?, ?, ?, ?)`,
        [userId, m.name, email, defaultPasswordHash, m.campus, m.photo]
      );
    }

    // Mentor profile
    await db.query(
      `INSERT INTO mentor_profiles 
        (user_id, university, study_program, semester, headline, bio, hourly_rate, discord_url, is_verified, is_published, rating_avg, rating_count, sessions_completed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        university = VALUES(university),
        study_program = VALUES(study_program),
        hourly_rate = VALUES(hourly_rate),
        rating_avg = VALUES(rating_avg),
        rating_count = VALUES(rating_count),
        sessions_completed = VALUES(sessions_completed)`,
      [
        userId,
        `Universitas ${m.campus}`,
        m.program,
        m.semester,
        m.headline,
        m.bio,
        m.rate,
        `https://discord.gg/tutorin-${m.name.split(" ")[0].toLowerCase()}`,
        m.rating,
        m.reviews,
        m.sessions,
      ]
    );

    // Wallet
    await db.query(
      `INSERT INTO wallets (user_id, available_balance, escrow_balance, total_earnings)
       VALUES (?, 0, 0, 0)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [userId]
    );

    // Mentor Subjects
    await db.query("DELETE FROM mentor_subjects WHERE mentor_id = ?", [userId]);
    for (const subName of m.subjects) {
      const subId = subjectByName.get(subName);
      if (subId) {
        await db.query("INSERT IGNORE INTO mentor_subjects (mentor_id, subject_id) VALUES (?, ?)", [userId, subId]);
      }
    }

    // Availability Slots
    await db.query("DELETE FROM availability_slots WHERE mentor_id = ?", [userId]);
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let d = 1; d <= 5; d++) {
      for (const hour of [16, 19]) {
        const start = new Date(base);
        start.setDate(base.getDate() + d);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1);
        await db.query(
          "INSERT INTO availability_slots (id, mentor_id, starts_at, ends_at, state) VALUES (?, ?, ?, ?, 'open')",
          [crypto.randomUUID(), userId, formatDate(start), formatDate(end)]
        );
      }
    }

    if (m.featured) featuredMentorId = userId;
    if (m.name.includes("Raka")) rakaMentorId = userId;
    if (m.name.includes("Gilang")) gilangMentorId = userId;
    console.log(`Seeded mentor: ${m.name}`);
  }

  // 5. Mentee Malvin
  let malvinId;
  const [malvinRows] = await db.query("SELECT id FROM users WHERE email = ?", ["malvin@kampus.ac.id"]);
  if (malvinRows.length > 0) {
    malvinId = malvinRows[0].id;
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [defaultPasswordHash, malvinId]);
  } else {
    malvinId = crypto.randomUUID();
    await db.query(
      "INSERT INTO users (id, role, full_name, email, password_hash, campus) VALUES (?, 'mahasiswa', ?, ?, ?, ?)",
      [malvinId, "Malvin", "malvin@kampus.ac.id", defaultPasswordHash, "UI"]
    );
  }

  let personalMalvinId = null;
  const [personalRows] = await db.query("SELECT id FROM users WHERE email = ?", ["malvinraditya2007@gmail.com"]);
  if (personalRows.length > 0) {
    personalMalvinId = personalRows[0].id;
  }

  // 6. Bersihkan booking lama dari Arif Pratama untuk Alya agar riwayat sesi selesai Alya tidak menumpuk
  if (featuredMentorId) {
    await db.query(
      `DELETE FROM review_highlights WHERE review_id IN (
         SELECT id FROM reviews WHERE booking_id IN (
           SELECT id FROM bookings WHERE mentor_id = ? AND student_id = ?
         )
       )`,
      [featuredMentorId, studentId]
    );
    await db.query(
      `DELETE FROM reviews WHERE booking_id IN (
         SELECT id FROM bookings WHERE mentor_id = ? AND student_id = ?
       )`,
      [featuredMentorId, studentId]
    );
    await db.query(
      `DELETE FROM payments WHERE booking_id IN (
         SELECT id FROM bookings WHERE mentor_id = ? AND student_id = ?
       )`,
      [featuredMentorId, studentId]
    );
    await db.query(
      "DELETE FROM bookings WHERE mentor_id = ? AND student_id = ?",
      [featuredMentorId, studentId]
    );
  }

  // 7. Seed Data Lengkap untuk Mentee (Sesi Aktif, Selesai, Menunggu Pembayaran, Notifikasi, Transaksi)
  async function seedMenteeComprehensive(targetStudentId) {
    // Hapus child tables terlebih dahulu agar aman dari foreign key constraint
    await db.query(
      `DELETE FROM review_highlights 
       WHERE review_id IN (SELECT id FROM reviews WHERE booking_id IN (SELECT id FROM bookings WHERE student_id = ?))`,
      [targetStudentId]
    );
    await db.query(
      `DELETE FROM reviews 
       WHERE booking_id IN (SELECT id FROM bookings WHERE student_id = ?)`,
      [targetStudentId]
    );
    await db.query(
      `DELETE FROM payments 
       WHERE booking_id IN (SELECT id FROM bookings WHERE student_id = ?)`,
      [targetStudentId]
    );
    await db.query("DELETE FROM notifications WHERE user_id = ?", [targetStudentId]);
    await db.query("DELETE FROM bookings WHERE student_id = ?", [targetStudentId]);

    const makeRef = () => `TTR-${Math.floor(1000 + Math.random() * 8999)}`;
    const now = new Date();
    const setTime = (baseDate, daysDelta, hour) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + daysDelta);
      d.setHours(hour, 0, 0, 0);
      return d;
    };

    // Sesi 1: AKTIF / MENDATANG TERDEKAT (Besok jam 19:00 WIB) — Aljabar Linear bersama Alya
    if (featuredMentorId) {
      const bId = crypto.randomUUID();
      const pId = crypto.randomUUID();
      const nId = crypto.randomUUID();
      const subId = subjectByName.get("Aljabar Linear");
      const start = setTime(now, 1, 19);
      const end = setTime(now, 1, 20);

      await db.query(
        `INSERT INTO bookings 
          (id, reference, student_id, mentor_id, subject_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
         VALUES (?, ?, ?, ?, ?, 'Nilai & Vektor Eigen + Diagonalisasi Matriks', ?, ?, '60', 'online', 'diterima', 65000)`,
        [bId, makeRef(), targetStudentId, featuredMentorId, subId, formatDate(start), formatDate(end)]
      );

      await db.query(
        `INSERT INTO payments 
          (id, booking_id, amount, service_fee, total, method, status, paid_at, provider, external_ref)
         VALUES (?, ?, 65000, 5200, 70200, 'ewallet', 'escrow', ?, 'gopay', ?)`,
        [pId, bId, formatDate(setTime(now, 0, 10)), `SIM-GOPAY-${Math.floor(1000 + Math.random() * 8999)}`]
      );

      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
         VALUES (?, ?, 'sesi', 'Sesi Belajar Dikonfirmasi', 'Alya Prameswari telah menerima jadwal sesi Aljabar Linear untuk besok pukul 19.00 WIB.', ?, 0, ?)`,
        [nId, targetStudentId, bId, formatDate(setTime(now, 0, 11))]
      );
    }

    // Sesi 2: AKTIF / MENDATANG (+3 Hari jam 16:00 WIB) — Pemrograman bersama Raka
    if (rakaMentorId) {
      const bId = crypto.randomUUID();
      const pId = crypto.randomUUID();
      const nId = crypto.randomUUID();
      const subId = subjectByName.get("Pemrograman");
      const start = setTime(now, 3, 16);
      const end = setTime(now, 3, 17);

      await db.query(
        `INSERT INTO bookings 
          (id, reference, student_id, mentor_id, subject_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
         VALUES (?, ?, ?, ?, ?, 'Dynamic Programming & Latihan Soal Algoritma', ?, ?, '60', 'online', 'diterima', 75000)`,
        [bId, makeRef(), targetStudentId, rakaMentorId, subId, formatDate(start), formatDate(end)]
      );

      await db.query(
        `INSERT INTO payments 
          (id, booking_id, amount, service_fee, total, method, status, paid_at, provider, external_ref)
         VALUES (?, ?, 75000, 6000, 81000, 'va', 'escrow', ?, 'bca_va', ?)`,
        [pId, bId, formatDate(setTime(now, 0, 14)), `SIM-BCAVA-${Math.floor(1000 + Math.random() * 8999)}`]
      );

      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
         VALUES (?, ?, 'pembayaran', 'Pembayaran Berhasil Diverifikasi', 'Pembayaran Rp81.000 untuk sesi Pemrograman telah masuk ke rekening escrow Tutorin.', ?, 0, ?)`,
        [nId, targetStudentId, bId, formatDate(setTime(now, 0, 14))]
      );
    }

    // Sesi 3: MENUNGGU PEMBAYARAN (+5 Hari jam 19:00 WIB) — Struktur Data bersama Raka
    if (rakaMentorId) {
      const bId = crypto.randomUUID();
      const pId = crypto.randomUUID();
      const nId = crypto.randomUUID();
      const subId = subjectByName.get("Struktur Data");
      const start = setTime(now, 5, 19);
      const end = setTime(now, 5, 20);

      await db.query(
        `INSERT INTO bookings 
          (id, reference, student_id, mentor_id, subject_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
         VALUES (?, ?, ?, ?, ?, 'Latihan Soal Binary Search Tree & Balanced Tree', ?, ?, '60', 'online', 'menunggu_pembayaran', 75000)`,
        [bId, makeRef(), targetStudentId, rakaMentorId, subId, formatDate(start), formatDate(end)]
      );

      await db.query(
        `INSERT INTO payments 
          (id, booking_id, amount, service_fee, total, status)
         VALUES (?, ?, 75000, 6000, 81000, 'diproses')`,
        [pId, bId]
      );

      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
         VALUES (?, ?, 'pembayaran', 'Menunggu Pembayaran', 'Segera selesaikan pembayaran sebesar Rp81.000 untuk sesi Struktur Data.', ?, 0, ?)`,
        [nId, targetStudentId, bId, formatDate(setTime(now, 0, 15))]
      );
    }

    // Sesi 4: SELESAI — BELUM DIULAS (2 hari lalu) — Kalkulus bersama Alya
    if (featuredMentorId) {
      const bId = crypto.randomUUID();
      const pId = crypto.randomUUID();
      const nId = crypto.randomUUID();
      const subId = subjectByName.get("Kalkulus");
      const start = setTime(now, -2, 19);
      const end = setTime(now, -2, 20);

      await db.query(
        `INSERT INTO bookings 
          (id, reference, student_id, mentor_id, subject_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
         VALUES (?, ?, ?, ?, ?, 'Integral Tentu & Teknik Substitusi Trigonometri', ?, ?, '60', 'online', 'selesai', 65000)`,
        [bId, makeRef(), targetStudentId, featuredMentorId, subId, formatDate(start), formatDate(end)]
      );

      await db.query(
        `INSERT INTO payments 
          (id, booking_id, amount, service_fee, total, method, status, paid_at, provider, external_ref)
         VALUES (?, ?, 65000, 5200, 70200, 'ewallet', 'selesai', ?, 'ovo', ?)`,
        [pId, bId, formatDate(setTime(now, -3, 10)), `SIM-OVO-${Math.floor(1000 + Math.random() * 8999)}`]
      );

      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
         VALUES (?, ?, 'ulasan', 'Beri Ulasan Sesi Belajar', 'Sesi Kalkulus bersama Alya Prameswari telah selesai. Bagaimana pengalaman belajarmu? Berikan ulasan!', ?, 0, ?)`,
        [nId, targetStudentId, bId, formatDate(setTime(now, -2, 21))]
      );
    }

    // Sesi 5: SELESAI — BELUM DIULAS 2 (4 hari lalu) — Fisika Dasar bersama Gilang Saputra
    if (gilangMentorId) {
      const bId = crypto.randomUUID();
      const pId = crypto.randomUUID();
      const nId = crypto.randomUUID();
      const subId = subjectByName.get("Fisika Dasar");
      const start = setTime(now, -4, 16);
      const end = setTime(now, -4, 17);

      await db.query(
        `INSERT INTO bookings 
          (id, reference, student_id, mentor_id, subject_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
         VALUES (?, ?, ?, ?, ?, 'Hukum Newton, Gaya Gesek & Dinamika Rotasi', ?, ?, '60', 'online', 'selesai', 60000)`,
        [bId, makeRef(), targetStudentId, gilangMentorId, subId, formatDate(start), formatDate(end)]
      );

      await db.query(
        `INSERT INTO payments 
          (id, booking_id, amount, service_fee, total, method, status, paid_at, provider, external_ref)
         VALUES (?, ?, 60000, 4800, 64800, 'ewallet', 'selesai', ?, 'gopay', ?)`,
        [pId, bId, formatDate(setTime(now, -5, 10)), `SIM-GOPAY-${Math.floor(1000 + Math.random() * 8999)}`]
      );

      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
         VALUES (?, ?, 'ulasan', 'Beri Ulasan Sesi Belajar', 'Sesi Fisika Dasar bersama Gilang Saputra telah selesai. Jangan lupa bagikan feedback belajarmu!', ?, 0, ?)`,
        [nId, targetStudentId, bId, formatDate(setTime(now, -4, 18))]
      );
    }

    // Sesi 6: SELESAI — SUDAH DIULAS (6 hari lalu) — Statistika bersama Alya
    if (featuredMentorId) {
      const bId = crypto.randomUUID();
      const pId = crypto.randomUUID();
      const rId = crypto.randomUUID();
      const nId = crypto.randomUUID();
      const subId = subjectByName.get("Statistika");
      const start = setTime(now, -6, 19);
      const end = setTime(now, -6, 20);

      await db.query(
        `INSERT INTO bookings 
          (id, reference, student_id, mentor_id, subject_id, topic, scheduled_start_at, scheduled_end_at, duration_minutes, mode, status, hourly_rate_snapshot)
         VALUES (?, ?, ?, ?, ?, 'Uji Hipotesis & Analisis Regresi Linear', ?, ?, '60', 'online', 'selesai', 65000)`,
        [bId, makeRef(), targetStudentId, featuredMentorId, subId, formatDate(start), formatDate(end)]
      );

      await db.query(
        `INSERT INTO payments 
          (id, booking_id, amount, service_fee, total, method, status, paid_at, provider, external_ref)
         VALUES (?, ?, 65000, 5200, 70200, 'va', 'selesai', ?, 'bca_va', ?)`,
        [pId, bId, formatDate(setTime(now, -7, 10)), `SIM-BCAVA-${Math.floor(1000 + Math.random() * 8999)}`]
      );

      await db.query(
        `INSERT INTO reviews (id, booking_id, rating, comment, is_anonymous, created_at)
         VALUES (?, ?, 5.0, 'Kak Alya cara jelasinnya enak banget, konsep rumus statistika yang rumit jadi gampang dipahami. Recommended tutor!', 0, ?)`,
        [rId, bId, formatDate(setTime(now, -6, 22))]
      );

      const h1 = highlightByLabel.get("Penjelasan jelas");
      const h2 = highlightByLabel.get("Sabar & ramah");
      if (h1) await db.query("INSERT IGNORE INTO review_highlights (review_id, highlight_id) VALUES (?, ?)", [rId, h1]);
      if (h2) await db.query("INSERT IGNORE INTO review_highlights (review_id, highlight_id) VALUES (?, ?)", [rId, h2]);

      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, booking_id, is_read, created_at)
         VALUES (?, ?, 'sesi', 'Ulasan Berhasil Terkirim', 'Terima kasih telah memberikan ulasan bintang 5 untuk sesi bersama Alya Prameswari.', ?, 1, ?)`,
        [nId, targetStudentId, bId, formatDate(setTime(now, -6, 22))]
      );
    }
  }

  // Jalankan seed sesi lengkap untuk malvin@kampus.ac.id
  if (malvinId) {
    await seedMenteeComprehensive(malvinId);
    console.log("Seeded comprehensive sessions for Malvin (malvin@kampus.ac.id)");
  }

  // Jika akun personal terdaftar di DB, ikut di-seed agar demo langsung jalan
  if (personalMalvinId && personalMalvinId !== malvinId) {
    await seedMenteeComprehensive(personalMalvinId);
    console.log("Seeded comprehensive sessions for personal Malvin account");
  }

  // Update saldo wallet mentor agar sinkron dengan sesi aktif dan selesai
  if (featuredMentorId) {
    await db.query(
      `UPDATE wallets 
       SET available_balance = 130000, escrow_balance = 130000, total_earnings = 130000 
       WHERE user_id = ?`,
      [featuredMentorId]
    );
  }
  if (rakaMentorId) {
    await db.query(
      `UPDATE wallets 
       SET available_balance = 0, escrow_balance = 75000, total_earnings = 0 
       WHERE user_id = ?`,
      [rakaMentorId]
    );
  }
  if (gilangMentorId) {
    await db.query(
      `UPDATE wallets 
       SET available_balance = 60000, escrow_balance = 0, total_earnings = 60000 
       WHERE user_id = ?`,
      [gilangMentorId]
    );
  }

  // 8. Seed Notifikasi, Rekening Payout & Mutasi Dompet Lengkap untuk Alya (Featured Mentor)
  if (featuredMentorId) {
    const now = new Date();
    const setTime = (baseDate, daysDelta, hour, minute = 0) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + daysDelta);
      d.setHours(hour, minute, 0, 0);
      return d;
    };

    // Bersihkan data lama Alya
    await db.query("DELETE FROM notifications WHERE user_id = ?", [featuredMentorId]);
    await db.query("DELETE FROM wallet_entries WHERE wallet_id = ?", [featuredMentorId]);
    await db.query("DELETE FROM payouts WHERE mentor_id = ?", [featuredMentorId]);
    await db.query("DELETE FROM payout_accounts WHERE mentor_id = ?", [featuredMentorId]);

    // Pastikan riwayat sesi selesai untuk Alya HANYA ada tepat 2 sesi (Kalkulus & Statistika) -> total pas Rp130.000
    const [completedRows] = await db.query(
      "SELECT id, subject_id FROM bookings WHERE mentor_id = ? AND status = 'selesai' ORDER BY scheduled_start_at DESC",
      [featuredMentorId]
    );

    const subjectKalkulus = subjectByName.get("Kalkulus");
    const subjectStatistika = subjectByName.get("Statistika");

    let keptKalkulus = null;
    let keptStatistika = null;
    const deleteIds = [];

    for (const b of completedRows) {
      if (b.subject_id === subjectKalkulus && !keptKalkulus) {
        keptKalkulus = b.id;
      } else if (b.subject_id === subjectStatistika && !keptStatistika) {
        keptStatistika = b.id;
      } else {
        deleteIds.push(b.id);
      }
    }

    if (deleteIds.length > 0) {
      const placeholders = deleteIds.map(() => "?").join(",");
      await db.query(
        `DELETE FROM review_highlights WHERE review_id IN (
           SELECT id FROM reviews WHERE booking_id IN (${placeholders})
         )`,
        deleteIds
      );
      await db.query(
        `DELETE FROM reviews WHERE booking_id IN (${placeholders})`,
        deleteIds
      );
      await db.query(
        `DELETE FROM payments WHERE booking_id IN (${placeholders})`,
        deleteIds
      );
      await db.query(
        `DELETE FROM bookings WHERE id IN (${placeholders})`,
        deleteIds
      );
    }

    // Pastikan sesi diterima/mendatang untuk Alya tepat 2 sesi (total Rp130.000 escrow)
    const [upcomingRows] = await db.query(
      "SELECT id FROM bookings WHERE mentor_id = ? AND status = 'diterima' ORDER BY scheduled_start_at ASC",
      [featuredMentorId]
    );
    if (upcomingRows.length > 2) {
      const extraUpcoming = upcomingRows.slice(2).map((b) => b.id);
      const ph = extraUpcoming.map(() => "?").join(",");
      await db.query(`DELETE FROM payments WHERE booking_id IN (${ph})`, extraUpcoming);
      await db.query(`DELETE FROM bookings WHERE id IN (${ph})`, extraUpcoming);
    }

    // 1. Rekening Bank Terverifikasi
    const accountId = crypto.randomUUID();
    await db.query(
      `INSERT INTO payout_accounts 
        (id, mentor_id, bank_name, account_number, account_name, is_verified, is_primary)
       VALUES (?, ?, 'BCA', '8210948123', 'Alya Prameswari', 1, 1)`,
      [accountId, featuredMentorId]
    );

    // 2. Mutasi Dompet (Wallet Entries) — 2 sesi selesai x Rp65.000 = Rp130.000 total pendapatan
    await db.query(
      `INSERT INTO wallet_entries (id, wallet_id, type, amount, description, created_at)
       VALUES (?, ?, 'in', 65000, 'Pelepasan escrow — Sesi Kalkulus (Malvin)', ?)`,
      [crypto.randomUUID(), featuredMentorId, formatDate(setTime(now, -4, 21, 0))]
    );

    await db.query(
      `INSERT INTO wallet_entries (id, wallet_id, type, amount, description, created_at)
       VALUES (?, ?, 'in', 65000, 'Pelepasan escrow — Sesi Statistika (Malvin)', ?)`,
      [crypto.randomUUID(), featuredMentorId, formatDate(setTime(now, -2, 21, 0))]
    );

    // 3. Notifikasi untuk Alya
    const notifsAlya = [
      {
        category: "sesi",
        title: "Jadwal Sesi Baru Terkonfirmasi",
        body: "Sesi Aljabar Linear bersama Malvin telah dijadwalkan untuk besok pukul 19.00 WIB. Tautan Discord aktif.",
        isRead: 0,
        createdAt: setTime(now, 0, 11, 0),
      },
      {
        category: "ulasan",
        title: "Ulasan Baru Bintang 5! ⭐",
        body: 'Malvin memberikan ulasan bintang 5: "Kak Alya cara jelasinnya enak banget, konsep rumus statistika yang rumit jadi gampang dipahami. Recommended tutor!"',
        isRead: 0,
        createdAt: setTime(now, -6, 22, 0),
      },
      {
        category: "pembayaran",
        title: "Pelepasan Dana Escrow",
        body: "Sesi Kalkulus bersama Malvin telah selesai. Saldo mengajar Rp65.000 otomatis masuk ke Saldo Tersedia.",
        isRead: 1,
        createdAt: setTime(now, -4, 21, 0),
      },
      {
        category: "pembayaran",
        title: "Pelepasan Dana Escrow",
        body: "Sesi Statistika bersama Malvin telah selesai. Saldo mengajar Rp65.000 otomatis masuk ke Saldo Tersedia.",
        isRead: 1,
        createdAt: setTime(now, -2, 21, 0),
      },
      {
        category: "sistem",
        title: "Profil Tutor Terverifikasi",
        body: "Selamat! Profil tutormu telah diverifikasi oleh tim Tutorin dan kini berstatus Tutor Unggulan di kampus ITB.",
        isRead: 1,
        createdAt: setTime(now, -14, 9, 0),
      },
    ];

    for (const n of notifsAlya) {
      await db.query(
        `INSERT INTO notifications (id, user_id, category, title, body, is_read, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [crypto.randomUUID(), featuredMentorId, n.category, n.title, n.body, n.isRead, formatDate(n.createdAt)]
      );
    }

    console.log("Seeded comprehensive wallet mutations & notifications for Alya Prameswari");
  }

  console.log("Seeding MySQL selesai!");
  await db.end();
}

seed().catch((err) => {
  console.error("Gagal melakukan seed:", err);
  process.exit(1);
});
