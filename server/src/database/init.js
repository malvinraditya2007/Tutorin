import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../lib/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  console.log("Memulai inisialisasi tabel MySQL...");

  const schemaPath = path.join(__dirname, "schema.sql");
  const rawSql = fs.readFileSync(schemaPath, "utf-8");

  // Hapus komentar SQL (-- ...)
  const cleanSql = rawSql.replace(/--.*$/gm, "");

  // Pisahkan query berdasarkan titik koma
  const statements = cleanSql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const conn = await db.getConnection();
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0;");
    for (const statement of statements) {
      await conn.query(statement);
    }
    await conn.query("SET FOREIGN_KEY_CHECKS = 1;");
    console.log("Semua tabel MySQL berhasil dibuat / sudah ada!");
  } catch (error) {
    console.error("Gagal inisialisasi database MySQL:", error);
    process.exit(1);
  } finally {
    conn.release();
    await db.end();
  }
}

init();
