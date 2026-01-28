<!-- src/views/Login.vue -->
<template>
  <main class="auth">
    <section class="card">
      <header class="head">
        <div class="logo">PP</div>
        <div>
          <h1>Ingresa a nuestra web</h1>
          <p>Accedé a Punto Pádel para encontrar canchas y reservar turnos.</p>
        </div>
      </header>

      <form class="form" @submit.prevent="onSubmit">
        <label class="field">
          <span class="label">Usuario de acceso</span>
          <input
            v-model.trim="username"
            type="text"
            placeholder="Ej: Tu nombre de usuario"
            autocomplete="username"
            required
          />
        </label>

        <label class="field">
          <span class="label">Contraseña</span>

          <div class="pass">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Tu contraseña"
              autocomplete="current-password"
              required
              minlength="4"
            />
            <button type="button" class="eye" @click="showPass = !showPass">
              {{ showPass ? 'Ocultar' : 'Ver' }}
            </button>
          </div>

          <small class="hint">La contraseña debe tener al menos 10 caracteres, debe de contener simbolos, numeros y mayusculas.</small>
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="btn" :disabled="loading">
          {{ loading ? 'Ingresando…' : 'Ingresar' }}
        </button>

        <footer class="foot">
          <span>¿No tenés cuenta?</span>
          <a href="#" @click.prevent="mockRegister">Crear una (demo)</a>
        </footer>
      </form>
    </section>
  </main>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      showPass: false,
      loading: false,
      error: "",
    };
  },
  methods: {
    async onSubmit() {
      this.error = "";
      const u = this.username;
      const p = this.password;

      // Validaciones simples (frontend)
     // Usuario
if (!u || u.length < 3) {
  this.error = "El usuario debe tener al menos 3 caracteres.";
  return;
}

// Contraseña: mínimo 10 caracteres
if (!p || p.length < 10) {
  this.error = "La contraseña debe tener al menos 10 caracteres.";
  return;
}

// Al menos una mayúscula
if (!/[A-Z]/.test(p)) {
  this.error = "La contraseña debe contener al menos una letra mayúscula.";
  return;
}

// Al menos un número
if (!/[0-9]/.test(p)) {
  this.error = "La contraseña debe contener al menos un número.";
  return;
}

// Al menos un símbolo
if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(p)) {
  this.error = "La contraseña debe contener al menos un símbolo.";
  return;
}


      // Simulamos un login real (luego se conecta al backend)
      this.loading = true;
      await new Promise((r) => setTimeout(r, 600));

      // Guardamos “sesión” demo
      const session = {
        username: u,
        loggedAt: new Date().toISOString(),
      };
      localStorage.setItem("pp_session", JSON.stringify(session));

      this.loading = false;

      // Redirige a Home
      this.$router.push("/home");
    },

    mockRegister() {
      alert("Demo: más adelante hacemos registro real con backend 🙂");
    },
  },
};
</script>

<style scoped>
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f3f4f6;
}

.card {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 12px 40px rgba(0,0,0,.08);
}

.head {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 18px;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #111827;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: .5px;
}

h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #111827;
}

.head p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.3;
}

.form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: #374151;
  font-weight: 700;
}

input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 14px;
}

input:focus {
  border-color: #111827;
  box-shadow: 0 0 0 4px rgba(17,24,39,.08);
}

.pass {
  display: flex;
  gap: 8px;
  align-items: center;
}

.eye {
  border: 1px solid #d1d5db;
  background: #fff;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
}

.hint {
  color: #6b7280;
  font-size: 12px;
}

.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fee2e2;
  color: #991b1b;
  font-weight: 700;
  font-size: 13px;
}

.btn {
  width: 100%;
  padding: 12px 14px;
  border: 0;
  border-radius: 12px;
  background: #111827;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  font-size: 14px;
}

.btn:disabled {
  opacity: .7;
  cursor: not-allowed;
}

.foot {
  display: flex;
  gap: 6px;
  justify-content: center;
  font-size: 13px;
  color: #6b7280;
}

.foot a {
  color: #111827;
  font-weight: 800;
}
</style>
