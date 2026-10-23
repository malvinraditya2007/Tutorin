import { Router } from "express";
import { asyncHandler } from "../middleware/auth.js";
import { getTutors, getTutorById } from "../lib/tutors.js";
import { listSubjects } from "../services/mentor.js";
import { listHighlightTags } from "../services/review.js";

const router = Router();

const toList = (v) =>
  v == null ? undefined : (Array.isArray(v) ? v : [v]).map(String).filter(Boolean);

/** Daftar tutor publik. Query: search, subjects, prices, ratings, sort, limit. */
router.get(
  "/tutors",
  asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const tutors = await getTutors(limit, {
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      subjects: toList(req.query.subjects),
      prices: toList(req.query.prices),
      ratings: toList(req.query.ratings),
      sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
    });
    res.json({ tutors });
  })
);

router.get(
  "/tutors/:id",
  asyncHandler(async (req, res) => {
    const tutor = await getTutorById(req.params.id);
    if (!tutor) return res.status(404).json({ error: "Tutor tidak ditemukan." });
    res.json({ tutor });
  })
);

router.get(
  "/subjects",
  asyncHandler(async (_req, res) => {
    res.json({ subjects: await listSubjects() });
  })
);

router.get(
  "/highlight-tags",
  asyncHandler(async (_req, res) => {
    res.json({ tags: await listHighlightTags() });
  })
);

export default router;
