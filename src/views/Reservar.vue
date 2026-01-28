<template>
  <div class="page">
    <h1>Reservar turno</h1>

    <div v-if="loading" class="state">Cargando cancha...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <div v-else class="card">
      <h3>{{ cancha.nombre }}</h3>
      <p class="muted">{{ cancha.ciudad }} — {{ cancha.direccion }}</p>
      <p class="muted">Horario: {{ cancha.apertura }} - {{ cancha.cierre }}</p>

      <div class="form">
        <label>Fecha</label>
        <input class="input" type="date" v-model="fecha" />

        <label>Hora inicio</label>
        <input class="input" type="time" v-model="horaInicio" />

        <label>Hora fin</label>
        <input class="input" type="time" v-model="horaFin" />
      </div>

      <button class="btn" @click="reservar" :disabled="saving">
        {{ saving ? "Reservando..." : "Confirmar reserva" }}
      </button>

      <div v-if="msg" class="state ok">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Reservar",
  data() {
    return {
      loading: true,
      saving: false,
      error: null,
      msg: "",
      cancha: null,
      fecha: "",
      horaInicio: "",
      horaFin: "",
    };
  },
  computed: {
    canchaId() {
      return this.$route.query.canchaId;
    },
    base() {
      return import.meta.env.VITE_API_URL || "http://localhost:3001";
    },
  },
  async mounted() {
    try {
      const res = await fetch(`${this.base}/canchas/${this.canchaId}`);
      const json = await res.json();
      this.cancha = json.data;
    } catch (e) {
      this.error = "No se pudo cargar la cancha";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async reservar() {
      this.msg = "";
      this.error = null;

      if (!this.fecha || !this.horaInicio || !this.horaFin) {
        this.error = "Completá fecha y horarios";
        return;
      }

      // MVP sin login: usamos un token fijo temporal (ver Paso 3)
      const token = localStorage.getItem("pp_token");
      if (!token) {
        this.error = "Primero activá el usuario de prueba (Paso 3).";
        return;
      }

      this.saving = true;
      try {
        const res = await fetch(`${this.base}/reservas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            canchaId: Number(this.canchaId),
            fecha: this.fecha,
            horaInicio: this.horaInicio,
            horaFin: this.horaFin,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error");

        this.msg = "✅ Reserva creada con éxito";
      } catch (e) {
        this.error = e.message || "No se pudo reservar";
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.page { padding: 24px; max-width: 720px; margin: 0 auto; }
.card { border: 1px solid #2b2b2b; border-radius: 16px; padding: 16px; background:#0f0f0f; }
.muted { opacity:.7; }
.form { display:grid; gap:8px; margin: 14px 0; }
.input { border: 1px solid #2b2b2b; background:#111; color:#fff; padding:10px 12px; border-radius:12px; }
.btn { border: 1px solid #2b2b2b; background:#fff; color:#111; padding:10px 14px; border-radius:12px; cursor:pointer; font-weight:700; }
.state { margin-top: 12px; padding: 12px; border: 1px dashed #333; border-radius: 12px; }
.state.error { border-color:#ff4d4d; color:#ff4d4d; }
.state.ok { border-color:#44ff88; color:#44ff88; }
</style>
