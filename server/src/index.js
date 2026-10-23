import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { loadUser } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
// Limit besar karena foto profil dikirim sebagai data URL (sudah dikompres di klien).
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(loadUser);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api", apiRoutes);

app.use("/api", (_req, res) => res.status(404).json({ error: "Endpoint tidak ditemukan." }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
});

app.listen(PORT, () => {
  console.log(`Tutorin API berjalan di http://localhost:${PORT}`);
});
