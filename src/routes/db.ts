import { Router } from "express";
import { pool } from "../lib/db.js";
const router = Router();

/**
 * @openapi
 * /db-health:
 *   get:
 *     summary: DB health
 *     tags: [System]
 *     responses:
 *       200: { description: OK }
 *       500: { description: Down }
 */
router.get("/db-health", async (_req, res) => {
  try {
    await pool.query("select 1");
    res.json({ db: "ok" });
  } catch {
    res.status(500).json({ db: "down" });
  }
});

export default router;
