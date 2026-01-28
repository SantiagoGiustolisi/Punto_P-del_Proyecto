<template>
  <div class="page">
    <header class="top">
      <div>
        <h1>Canchas</h1>
        <p class="muted">Buscá por ciudad y encontrá tu lugar para jugar.</p>
      </div>

      <div class="actions">
        <input
          v-model="q"
          class="input"
          type="text"
          placeholder="Buscar por nombre o ciudad…"
        />

        <select v-model="city" class="select">
          <option value="">Todas</option>
          <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
        </select>

        <button class="btn" @click="reload" :disabled="loading">
          {{ loading ? "Cargando…" : "Actualizar" }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="state">Cargando canchas…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <div v-else class="grid">
      <article v-for="c in filtered" :key="c.id" class="card">
        <div class="cardHead">
          <h3 class="title">{{ c.nombre }}</h3>
          <span class="pill">${{ formatMoney(c.precio_hora) }}/h</span>
        </div>

        <div class="meta">
          <div><strong>Ciudad:</strong> {{ c.ciudad }}</div>
          <div><strong>Dirección:</strong> {{ c.direccion }}</div>
          <div><strong>Horario:</strong> {{ c.apertura }} - {{ c.cierre }}</div>
        </div>

        <div class="cardActions">
          <button class="btn ghost" @click="goReserva(c.id)">
            Reservar
          </button>
          <button class="btn" @click="goDetalle(c.id)">
            Ver detalle
          </button>
        </div>
      </article>
    </div>

    <div v-if="!loading && !error && filtered.length === 0" class="state">
      No se encontraron canchas con ese filtro.
    </div>
  </div>
</template>

<script>
export default {
  name: "Canchas",
  data() {
    return {
      canchas: [],
      loading: true,
      error: null,
      q: "",
      city: "",
    };
  },
  computed: {
    cities() {
      const set = new Set(this.canchas.map((c) => c.ciudad).filter(Boolean));
      return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
    },
    filtered() {
      const q = this.q.trim().toLowerCase();
      const city = this.city.trim().toLowerCase();

      return this.canchas.filter((c) => {
        const hayCity = !city || String(c.ciudad || "").toLowerCase() === city;

        if (!q) return hayCity;

        const text = `${c.nombre} ${c.ciudad} ${c.direccion}`.toLowerCase();
        return hayCity && text.includes(q);
      });
    },
  },
  methods: {
    formatMoney(n) {
      const num = Number(n || 0);
      return num.toLocaleString("es-AR");
    },
    async reload() {
      this.loading = true;
      this.error = null;
      try {
        const base = import.meta.env.VITE_API_URL || "http://localhost:3001";
        const res = await fetch(`${base}/canchas`);
        const json = await res.json();
        this.canchas = json.data || [];
      } catch (e) {
        this.error = "No se pudo cargar el listado. ¿Está corriendo el backend en :3001?";
      } finally {
        this.loading = false;
      }
    },
    goDetalle(id) {
      this.$router.push({ name: "cancha-detalle", params: { id } });
    },
    goReserva(id) {
      this.$router.push({ name: "reservar", query: { canchaId: id } });
    },
  },
  mounted() {
    this.reload();
  },
};
</script>

<style scoped>
.page {
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}
.top {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.muted {
  opacity: 0.7;
  margin: 6px 0 0;
}
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.input, .select {
  border: 1px solid #2b2b2b;
  background: #111;
  color: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  outline: none;
}
.input { min-width: 260px; }
.select { min-width: 160px; }

.btn {
  border: 1px solid #2b2b2b;
  background: #fff;
  color: #111;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.btn.ghost {
  background: transparent;
  color: #fff;
}

.state {
  padding: 16px;
  border: 1px dashed #333;
  border-radius: 12px;
}
.state.error {
  border-color: #ff4d4d;
  color: #ff4d4d;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.card {
  border: 1px solid #2b2b2b;
  border-radius: 16px;
  padding: 14px;
  background: #0f0f0f;
}
.cardHead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.title {
  margin: 0;
  font-size: 18px;
}
.pill {
  border: 1px solid #2b2b2b;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  background: #141414;
}
.meta {
  margin-top: 12px;
  display: grid;
  gap: 6px;
  font-size: 14px;
  opacity: 0.9;
}
.cardActions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
