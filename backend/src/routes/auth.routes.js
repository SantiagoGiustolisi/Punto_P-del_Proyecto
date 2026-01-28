const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { initDb } = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body || {};
  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, error: "Faltan datos" });
  }

  const db = await initDb();

  const exists = await db.get(`SELECT id FROM users WHERE email = ?`, [email.toLowerCase()]);
  if (exists) return res.status(409).json({ ok: false, error: "Email ya registrado" });

  const password_hash = await bcrypt.hash(password, 10);
  const result = await db.run(
    `INSERT INTO users (nombre, email, password_hash) VALUES (?, ?, ?)`,
    [nombre, email.toLowerCase(), password_hash]
  );

  const user = { id: result.lastID, nombre, email: email.toLowerCase() };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.json({ ok: true, data: { user, token } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: "Faltan datos" });
  }

  const db = await initDb();
  const userRow = await db.get(
    `SELECT id, nombre, email, password_hash FROM users WHERE email = ?`,
    [email.toLowerCase()]
  );

  if (!userRow) return res.status(401).json({ ok: false, error: "Credenciales inválidas" });

  const ok = await bcrypt.compare(password, userRow.password_hash);
  if (!ok) return res.status(401).json({ ok: false, error: "Credenciales inválidas" });

  const user = { id: userRow.id, nombre: userRow.nombre, email: userRow.email };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.json({ ok: true, data: { user, token } });
});

module.exports = router;
