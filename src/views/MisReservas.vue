<template>
  <div class="page">
    <h1>Mis reservas</h1>

    <div v-if="loading" class="state">Cargando reservas...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <div v-else class="grid">
      <div v-for="r in reservas" :key="r.id" class="card">
        <h3>{{ r.cancha_nombre }} ({{ r.cancha_ciudad }})</h3>
        <p class="muted">{{ r.fecha }} — {{ r.hora_inicio }} a {{ r.hora_fin }}</p>
        <p class="muted">Estado: {{ r.estado }}</p>

        <button class="btn ghost" @click="cancelar(r.id)" v-if="r.estado === 'activa'">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MisReservas",
  data() {
    return { reservas: [], loading: true, error: null };
  },
  computed: {
    base() {
      return import.meta.env.VITE_API_URL || "http://localhost:3001";
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = null;

      const token = localStorage.getItem("pp_token");
      if (!token) {
        this.error = "Primero activá el usuario de prueba (Paso 3).";
        this.loading = false;
        return;
      }

      try {
        const res = await fetch(`${this.base}/reservas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error");
        this.reservas = json.data || [];
      } catch (e) {
        this.error = e.message || "No se pudieron cargar reservas";
      } finally {
        this.loading = false;
      }
    },
    async cancelar(id) {
      const token = localStorage.getItem("pp_token");
      try {
        const res = await fetch(`${this.base}/reservas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error");
        await this.load();
      } catch (e) {
        alert(e.message || "No se pudo cancelar");
      }
    },
  },
  mounted() {
    this.load();
  },
};
</script>

<style scoped>
.page { padding: 24px; max-width: 1100px; margin: 0 auto; }
.grid { display:grid; gap:14px; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.card { border: 1px solid #2b2b2b; border-radius: 16px; padding: 14px; background:#0f0f0f; }
.muted { opacity:.7; }
.btn { border: 1px solid #2b2b2b; background:#fff; color:#111; padding:10px 14px; border-radius:12px; cursor:pointer; font-weight:700; }
.btn.ghost { background: transparent; color:#fff; }
.state { padding: 16px; border: 1px dashed #333; border-radius: 12px; }
.state.error { border-color:#ff4d4d; color:#ff4d4d; }
</style>
