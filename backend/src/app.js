require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

const authRoutes = require("./routes/auth.routes");
const canchasRoutes = require("./routes/canchas.routes");
const reservasRoutes = require("./routes/reservas.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  await initDb();
  res.json({ ok: true, data: "pong" });
});

app.use("/auth", authRoutes);
app.use("/canchas", canchasRoutes);
app.use("/reservas", reservasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
