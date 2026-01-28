const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

let db;

async function initDb() {
  if (db) return db;

  db = await open({
    filename: path.join(__dirname, "..", "database.sqlite"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS canchas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      ciudad TEXT NOT NULL,
      direccion TEXT NOT NULL,
      precio_hora INTEGER NOT NULL,
      apertura TEXT NOT NULL,
      cierre TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      cancha_id INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'activa',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (cancha_id) REFERENCES canchas(id) ON DELETE CASCADE
    );
  `);

  // Seed canchas si está vacío
  const row = await db.get(`SELECT COUNT(*) as c FROM canchas`);
  if (row.c === 0) {
    const seeds = [
      ["Punto Pádel Center", "Balnearia", "Av. Principal 123", 9000, "08:00", "23:00"],
      ["Miramar Pádel Club", "Miramar", "Costanera 456", 10000, "09:00", "00:00"],
      ["Córdoba Pádel Arena", "Córdoba", "Bv. San Juan 789", 14000, "07:00", "23:30"],
      ["Morteros Pádel House", "Morteros", "Ruta 1 Km 2", 9500, "08:30", "22:30"],
      ["Brinkmann Pádel", "Brinkmann", "Mitre 55", 8500, "08:00", "22:00"],
    ];

    const stmt = await db.prepare(`
      INSERT INTO canchas (nombre, ciudad, direccion, precio_hora, apertura, cierre)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    try {
      for (const s of seeds) await stmt.run(s);
    } finally {
      await stmt.finalize();
    }
  }

  return db;
}

module.exports = { initDb };
