-- Tutorin MySQL Schema

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  role ENUM('mahasiswa', 'mentor') NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  campus VARCHAR(255) NULL,
  avatar_url MEDIUMTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mentor_profiles (
  user_id VARCHAR(36) PRIMARY KEY,
  university VARCHAR(255) NOT NULL,
  study_program VARCHAR(255) NOT NULL,
  semester SMALLINT NULL,
  headline VARCHAR(255) NULL,
  bio TEXT NULL,
  hourly_rate INT NOT NULL,
  discord_url VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  rating_avg DECIMAL(2, 1) DEFAULT 0.0,
  rating_count INT DEFAULT 0,
  sessions_completed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_mp_published (is_published),
  INDEX idx_mp_hourly_rate (hourly_rate),
  INDEX idx_mp_rating_avg (rating_avg)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  icon VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mentor_subjects (
  mentor_id VARCHAR(36) NOT NULL,
  subject_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (mentor_id, subject_id),
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
  INDEX idx_ms_subject_id (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS availability_slots (
  id VARCHAR(36) PRIMARY KEY,
  mentor_id VARCHAR(36) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  state ENUM('open', 'booked', 'closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(user_id) ON DELETE CASCADE,
  INDEX idx_slots_mentor_starts (mentor_id, starts_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(36) PRIMARY KEY,
  reference VARCHAR(50) NOT NULL UNIQUE,
  student_id VARCHAR(36) NOT NULL,
  mentor_id VARCHAR(36) NOT NULL,
  subject_id VARCHAR(36) NOT NULL,
  slot_id VARCHAR(36) UNIQUE NULL,
  topic TEXT NULL,
  scheduled_start_at DATETIME NOT NULL,
  scheduled_end_at DATETIME NOT NULL,
  duration_minutes ENUM('45', '60', '90') NOT NULL,
  mode ENUM('online', 'offline') NOT NULL,
  status ENUM('menunggu_pembayaran', 'dibayar', 'diterima', 'selesai', 'ditolak', 'kedaluwarsa', 'dibatalkan', 'refund') DEFAULT 'menunggu_pembayaran',
  hourly_rate_snapshot INT NOT NULL,
  expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(user_id) ON DELETE RESTRICT,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE RESTRICT,
  FOREIGN KEY (slot_id) REFERENCES availability_slots(id) ON DELETE SET NULL,
  INDEX idx_bookings_student (student_id, scheduled_start_at),
  INDEX idx_bookings_mentor (mentor_id, scheduled_start_at),
  INDEX idx_bookings_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL UNIQUE,
  amount INT NOT NULL,
  service_fee INT NOT NULL,
  total INT NOT NULL,
  method ENUM('ewallet', 'va', 'card') NULL,
  status ENUM('diproses', 'escrow', 'selesai', 'refund') DEFAULT 'diproses',
  provider VARCHAR(255) NULL,
  external_ref VARCHAR(255) NULL,
  paid_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS highlight_tags (
  id VARCHAR(36) PRIMARY KEY,
  label VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(36) PRIMARY KEY,
  booking_id VARCHAR(36) NOT NULL UNIQUE,
  rating SMALLINT NOT NULL,
  comment TEXT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review_highlights (
  review_id VARCHAR(36) NOT NULL,
  highlight_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (review_id, highlight_id),
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY (highlight_id) REFERENCES highlight_tags(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wallets (
  user_id VARCHAR(36) PRIMARY KEY,
  available_balance INT DEFAULT 0,
  escrow_balance INT DEFAULT 0,
  total_earnings INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES mentor_profiles(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payout_accounts (
  id VARCHAR(36) PRIMARY KEY,
  mentor_id VARCHAR(36) NOT NULL,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(user_id) ON DELETE CASCADE,
  INDEX idx_payout_accounts_mentor (mentor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payouts (
  id VARCHAR(36) PRIMARY KEY,
  mentor_id VARCHAR(36) NOT NULL,
  account_id VARCHAR(36) NOT NULL,
  amount INT NOT NULL,
  status ENUM('diproses', 'selesai', 'gagal') DEFAULT 'diproses',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  FOREIGN KEY (mentor_id) REFERENCES mentor_profiles(user_id) ON DELETE RESTRICT,
  FOREIGN KEY (account_id) REFERENCES payout_accounts(id) ON DELETE RESTRICT,
  INDEX idx_payouts_mentor (mentor_id, requested_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wallet_entries (
  id VARCHAR(36) PRIMARY KEY,
  wallet_id VARCHAR(36) NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  amount INT NOT NULL,
  description TEXT NOT NULL,
  booking_id VARCHAR(36) NULL,
  payout_id VARCHAR(36) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(user_id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  FOREIGN KEY (payout_id) REFERENCES payouts(id) ON DELETE SET NULL,
  INDEX idx_wallet_entries_wallet (wallet_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category ENUM('sesi', 'pembayaran', 'ulasan', 'sistem') NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NULL,
  booking_id VARCHAR(36) NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_notifications_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
