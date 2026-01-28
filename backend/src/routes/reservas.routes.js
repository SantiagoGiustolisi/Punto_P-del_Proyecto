const express = require("express");
const { initDb } = require("../db");
const { auth } = require("../middleware/auth");

const router = express.Router();

function toMin(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  return h * 60 + m;
}
function isValidTime(t) {
  return /^\d{2}:\d{2}$/.test(t);
}

router.get("/", auth, async (req, res) => {
  const db = await initDb();
  const rows = await db.all(
    `SELECT r.*, c.nombre as cancha_nombre, c.ciudad as cancha_ciudad
     FROM reservas r
     JOIN canchas c ON c.id = r.cancha_id
     WHERE r.user_id = ?
     ORDER BY r.fecha DESC, r.hora_inicio DESC`,
    [req.user.id]
  );
  return res.json({ ok: true, data: rows });
});

router.post("/", auth, async (req, res) => {
  const { canchaId, fecha, horaInicio, horaFin } = req.body || {};
  if (!canchaId || !fecha || !horaInicio || !horaFin) {
    return res.status(400).json({ ok: false, error: "Faltan datos" });
  }
  if (!isValidTime(horaInicio) || !isValidTime(horaFin)) {
    return res.status(400).json({ ok: false, error: "Formato hora inválido" });
  }

  const db = await initDb();

  const cancha = await db.get(`SELECT * FROM canchas WHERE id = ?`, [canchaId]);
  if (!cancha) return res.status(404).json({ ok: false, error: "Cancha no encontrada" });

  const start = toMin(horaInicio);
  const end = toMin(horaFin);
  if (end <= start) return res.status(400).json({ ok: false, error: "Rango horario inválido" });

  const open = toMin(cancha.apertura);
  const close = toMin(cancha.cierre);
  const closeAdj = close <= open ? close + 24 * 60 : close;

  const startAdj = start < open ? start + 24 * 60 : start;
  const endAdj = end < open ? end + 24 * 60 : end;

  if (startAdj < open || endAdj > closeAdj) {
    return res.status(400).json({
      ok: false,
      error: `Fuera de horario. Disponible ${cancha.apertura} a ${cancha.cierre}`,
    });
  }

  const existing = await db.all(
    `SELECT * FROM reservas
     WHERE cancha_id = ? AND fecha = ? AND estado = 'activa'`,
    [canchaId, fecha]
  );

  const overlaps = existing.some((r) => {
    const a1 = toMin(r.hora_inicio);
    const a2 = toMin(r.hora_fin);
    return start < a2 && end > a1;
  });

  if (overlaps) return res.status(409).json({ ok: false, error: "Horario ocupado" });

  const result = await db.run(
    `INSERT INTO reservas (user_id, cancha_id, fecha, hora_inicio, hora_fin)
     VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, canchaId, fecha, horaInicio, horaFin]
  );

  const created = await db.get(`SELECT * FROM reservas WHERE id = ?`, [result.lastID]);
  return res.json({ ok: true, data: created });
});

router.delete("/:id", auth, async (req, res) => {
  const db = await initDb();
  const row = await db.get(`SELECT * FROM reservas WHERE id = ?`, [req.params.id]);

  if (!row) return res.status(404).json({ ok: false, error: "Reserva no encontrada" });
  if (row.user_id !== req.user.id) return res.status(403).json({ ok: false, error: "No autorizado" });

  await db.run(`UPDATE reservas SET estado = 'cancelada' WHERE id = ?`, [req.params.id]);
  return res.json({ ok: true, data: { id: row.id, estado: "cancelada" } });
});

module.exports = router;
