import { Router } from "express";
import { registerSchema, loginSchema } from "../schemas/index.js";
import { registerUser, verifyCredentials, AccountError } from "../services/account.js";
import {
  asyncHandler,
  setSessionCookie,
  clearSessionCookie,
  publicUser,
} from "../middleware/auth.js";

const router = Router();

/** Daftar akun email/password lalu langsung login (cookie sesi). */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Input tidak valid." });
    }
    try {
      const user = await registerUser(parsed.data);
      setSessionCookie(res, user.id);
      res.status(201).json({ user: publicUser(user) });
    } catch (e) {
      if (e instanceof AccountError) return res.status(409).json({ error: e.message });
      throw e;
    }
  })
);

/** Login email/password. */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.issues[0]?.message ?? "Input tidak valid." });
    }
    const user = await verifyCredentials(parsed.data.email, parsed.data.password);
    if (!user) return res.status(401).json({ error: "Email atau password salah." });
    setSessionCookie(res, user.id);
    res.json({ user: publicUser(user) });
  })
);

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

/** User saat ini (null bila belum login). */
router.get("/me", (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

export default router;
