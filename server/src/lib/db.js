import mysql from "mysql2/promise";

/**
 * Konfigurasi koneksi MySQL pool.
 * Mendukung URL tunggal (DATABASE_URL) atau variabel terpisah (DB_HOST, dll).
 * Otomatis mengaktifkan SSL jika menggunakan Cloud MySQL (TiDB Cloud, Aiven, Railway).
 */
function createConnectionConfig() {
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL;

  if (url && (url.startsWith("mysql://") || url.startsWith("mysqls://"))) {
    const parsed = new URL(url);
    const useSsl =
      process.env.DB_SSL === "true" ||
      parsed.searchParams.get("ssl") === "true" ||
      parsed.searchParams.get("sslmode") === "require" ||
      parsed.hostname.includes("tidbcloud.com") ||
      parsed.hostname.includes("aivencloud.com");

    return {
      host: parsed.hostname,
      port: Number(parsed.port || 3306),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, ""),
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true, // Kembalikan string untuk DATETIME/TIMESTAMP agar format konsisten
    };
  }

  const useSsl =
    process.env.DB_SSL === "true" ||
    (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com"));

  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "tutorin_db",
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  };
}

export const db = mysql.createPool(createConnectionConfig());

/**
 * Jalankan serangkaian operasi di dalam transaksi atomik MySQL.
 * Jika terjadi error, otomatis di-ROLLBACK. Jika sukses, di-COMMIT.
 *
 * @template T
 * @param {(conn: mysql.PoolConnection) => Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withTransaction(fn) {
  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
