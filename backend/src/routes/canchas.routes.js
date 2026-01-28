const express = require("express");
const { initDb } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const { ciudad } = req.query;
  const db = await initDb();

  let rows;
  if (ciudad) {
    rows = await db.all(
      `SELECT * FROM canchas WHERE LOWER(ciudad) = LOWER(?) ORDER BY nombre`,
      [ciudad]
    );
  } else {
    rows = await db.all(`SELECT * FROM canchas ORDER BY ciudad, nombre`);
  }

  return res.json({ ok: true, data: rows });
});

router.get("/:id", async (req, res) => {
  const db = await initDb();
  const row = await db.get(`SELECT * FROM canchas WHERE id = ?`, [req.params.id]);
  if (!row) return res.status(404).json({ ok: false, error: "Cancha no encontrada" });
  return res.json({ ok: true, data: row });
});

module.exports = router;
