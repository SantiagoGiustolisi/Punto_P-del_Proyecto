<!-- src/views/Login.vue -->
<template>
  <main class="auth">
    <!-- Fondo decorativo -->
    <div class="bg">
      <div class="blob b1"></div>
      <div class="blob b2"></div>
      <div class="grid"></div>
    </div>

    <section class="card" aria-label="Login Punto Pádel">
      <header class="head">
        <div class="brand">
          <div class="mark" aria-hidden="true">
            <span class="pp">PP</span>
          </div>
          <div class="titles">
            <h1>Punto Pádel</h1>
            <p>Ingresá para ver canchas y reservar turnos.</p>
          </div>
        </div>
      </header>

      <form class="form" @submit.prevent="onSubmit" novalidate>
        <!-- Usuario -->
        <label class="field">
          <span class="label">Usuario</span>

          <div class="control" :class="{ invalid: !!error && touched.user }">
            <span class="icon" aria-hidden="true">
              <!-- user icon -->
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21a8 8 0 0 0-16 0"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <input
              v-model.trim="username"
              type="text"
              placeholder="Ej: alejochiaretta"
              autocomplete="username"
              @blur="touched.user = true"
              :aria-invalid="!!error && touched.user"
              required
            />
          </div>

          <small class="helper">Mínimo 3 caracteres.</small>
        </label>

        <!-- Contraseña -->
        <label class="field">
          <span class="label">Contraseña</span>

          <div class="control" :class="{ invalid: !!error && touched.pass }">
            <span class="icon" aria-hidden="true">
              <!-- lock icon -->
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 11V8a5 5 0 0 1 10 0v3"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M6 11h12v10H6V11Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </span>

            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              placeholder="Tu contraseña"
              autocomplete="current-password"
              @blur="touched.pass = true"
              :aria-invalid="!!error && touched.pass"
              required
            />

            <button
              class="iconBtn"
              type="button"
              @click="showPass = !showPass"
              :aria-label="showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              title="Mostrar/Ocultar"
            >
              <svg v-if="!showPass" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3l18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M10.6 10.6a3 3 0 0 0 4.2 4.2"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M6.2 6.2C3.7 8 2 12 2 12s3.5 7 10 7c2 0 3.7-.6 5.1-1.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <path
                  d="M9.9 5.1C10.6 5 11.3 5 12 5c6.5 0 10 7 10 7s-1.1 2.2-3.4 4.2"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <small class="helper">
            Mínimo 10 caracteres, 1 mayúscula, 1 número y 1 símbolo.
          </small>
        </label>

        <!-- Row opciones -->
        <div class="row">
          <label class="check">
            <input type="checkbox" v-model="remember" />
            <span>Recordarme</span>
          </label>

          <a class="link" href="#" @click.prevent="forgot">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert" role="alert">
          <strong>Ups:</strong> {{ error }}
        </div>

        <!-- CTA -->
        <button class="btn" :disabled="loading">
          <span v-if="!loading">Ingresar</span>
          <span v-else class="spinner" aria-hidden="true"></span>
          <span v-if="loading" class="loadingText">Ingresando…</span>
        </button>

        <!-- Footer -->
        <footer class="foot">
          <span>¿No tenés cuenta?</span>
          <a href="#" class="link strong" @click.prevent="mockRegister">Crear una (demo)</a>
        </footer>
      </form>

      <div class="divider"></div>

      <div class="legal">
        <span>Al ingresar aceptás nuestros</span>
        <a href="#" class="link" @click.prevent="openTerms">Términos</a>
        <span>y</span>
        <a href="#" class="link" @click.prevent="openPrivacy">Privacidad</a>
      </div>
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
      remember: true,
      loading: false,
      error: "",
      touched: { user: false, pass: false },
    };
  },
  methods: {
    validate(u, p) {
      // Usuario
      if (!u || u.length < 3) return "El usuario debe tener al menos 3 caracteres.";

      // Contraseña: mínimo 10 caracteres
      if (!p || p.length < 10) return "La contraseña debe tener al menos 10 caracteres.";

      // Al menos una mayúscula
      if (!/[A-Z]/.test(p)) return "La contraseña debe contener al menos una letra mayúscula.";

      // Al menos un número
      if (!/[0-9]/.test(p)) return "La contraseña debe contener al menos un número.";

      // Al menos un símbolo
      if (!/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(p))
        return "La contraseña debe contener al menos un símbolo.";

      return "";
    },

    async onSubmit() {
      this.error = "";
      this.touched.user = true;
      this.touched.pass = true;

      const u = this.username?.trim();
      const p = this.password;

      const err = this.validate(u, p);
      if (err) {
        this.error = err;
        return;
      }

      // Simulamos login real (luego backend)
      this.loading = true;
      await new Promise((r) => setTimeout(r, 650));

      const session = {
        username: u,
        loggedAt: new Date().toISOString(),
      };

      // Si "recordarme" es false podrías guardar en sessionStorage (opcional)
      const storage = this.remember ? localStorage : sessionStorage;
      storage.setItem("pp_session", JSON.stringify(session));

      this.loading = false;

      // Redirige a Home (ajustalo a tu ruta real)
      this.$router.push("/home");
    },

    forgot() {
      alert("Demo: acá iría el flujo de recuperación por email o WhatsApp 🙂");
    },

    mockRegister() {
      alert("Demo: más adelante hacemos registro real con backend 🙂");
    },

    openTerms() {
      alert("Demo: Términos y condiciones (pendiente).");
    },

    openPrivacy() {
      alert("Demo: Política de privacidad (pendiente).");
    },
  },
};
</script>

<style scoped>
/* =========================
   Login — Punto Pádel (PRO)
========================= */
.auth{
  min-height: 100vh;
  display:grid;
  place-items:center;
  padding: 28px 16px;
  position:relative;
  overflow:hidden;
  background: #070a12;
  color: #0f172a;
}

/* Fondo */
.bg{position:absolute; inset:0; pointer-events:none;}
.grid{
  position:absolute; inset:-2px;
  background:
    linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(circle at 50% 30%, rgba(0,0,0,.9), transparent 60%);
  opacity:.22;
}
.blob{
  position:absolute;
  width: 520px;
  height: 520px;
  filter: blur(40px);
  opacity:.55;
  border-radius: 999px;
}
.b1{left:-180px; top:-200px; background: radial-gradient(circle at 30% 30%, #22c55e, transparent 65%);}
.b2{right:-220px; bottom:-240px; background: radial-gradient(circle at 30% 30%, #60a5fa, transparent 65%);}

/* Card */
.card{
  width: 100%;
  max-width: 520px;
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 18px 60px rgba(0,0,0,.45);
  backdrop-filter: blur(10px);
  position:relative;
}

.head{margin-bottom: 14px;}
.brand{
  display:flex;
  gap: 14px;
  align-items:center;
}
.mark{
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #111827, #0b1220);
  color:#fff;
  display:grid;
  place-items:center;
  box-shadow: 0 10px 26px rgba(0,0,0,.22);
}
.pp{
  font-weight: 900;
  letter-spacing: .5px;
  font-size: 16px;
}
.titles h1{
  margin:0;
  font-size: 22px;
  font-weight: 900;
  color:#0b1220;
}
.titles p{
  margin: 4px 0 0;
  color:#475569;
  font-size: 14px;
  line-height: 1.35;
}

/* Form */
.form{display:grid; gap: 14px; margin-top: 14px;}
.field{display:grid; gap: 7px;}
.label{
  font-size: 13px;
  color:#334155;
  font-weight: 800;
}

.control{
  display:flex;
  align-items:center;
  gap: 10px;
  border: 1px solid rgba(15,23,42,.18);
  background:#ffffff;
  border-radius: 14px;
  padding: 10px 12px;
  transition: .18s ease;
}
.control:focus-within{
  border-color: rgba(34,197,94,.65);
  box-shadow: 0 0 0 5px rgba(34,197,94,.18);
}
.control.invalid{
  border-color: rgba(239,68,68,.65);
  box-shadow: 0 0 0 5px rgba(239,68,68,.14);
}

.icon{
  width: 18px;
  height: 18px;
  color:#0f172a;
  opacity:.85;
}
.icon svg{width:18px;height:18px;display:block;}

.control input{
  width:100%;
  border:0;
  outline:none;
  font-size: 14px;
  padding: 2px 0;
  background: transparent;
  color:#0b1220;
}
.control input::placeholder{color:#94a3b8}

.iconBtn{
  border:0;
  background: transparent;
  cursor:pointer;
  padding: 6px;
  border-radius: 10px;
  color:#0f172a;
  opacity:.8;
  transition: .15s ease;
}
.iconBtn:hover{background: rgba(15,23,42,.06); opacity:1;}
.iconBtn svg{width:18px;height:18px;display:block;}

.helper{
  color:#64748b;
  font-size: 12px;
  margin-top: -2px;
}

/* Row */
.row{
  display:flex;
  justify-content: space-between;
  align-items:center;
  gap: 10px;
  margin-top: 2px;
}
.check{
  display:flex;
  align-items:center;
  gap: 8px;
  font-size: 13px;
  color:#475569;
  user-select:none;
}
.check input{width:16px;height:16px}

.link{
  color:#0b1220;
  font-size: 13px;
  text-decoration:none;
}
.link:hover{text-decoration: underline}
.strong{font-weight: 900}

/* Alert */
.alert{
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(239,68,68,.12);
  border: 1px solid rgba(239,68,68,.25);
  color:#991b1b;
  font-size: 13px;
  font-weight: 700;
}

/* Button */
.btn{
  width:100%;
  border:0;
  border-radius: 14px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color:#06210f;
  font-weight: 900;
  cursor:pointer;
  font-size: 14px;
  box-shadow: 0 14px 34px rgba(34,197,94,.26);
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 10px;
  transition:.15s ease;
}
.btn:hover{transform: translateY(-1px);}
.btn:disabled{opacity:.7; cursor:not-allowed; transform:none;}

.spinner{
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(6,33,15,.28);
  border-top-color: rgba(6,33,15,.9);
  animation: spin .75s linear infinite;
}
.loadingText{font-weight: 900}
@keyframes spin{to{transform: rotate(360deg)}}

/* Footer + legal */
.foot{
  display:flex;
  justify-content:center;
  gap: 6px;
  font-size: 13px;
  color:#64748b;
  margin-top: 2px;
}

.divider{
  height: 1px;
  background: rgba(15,23,42,.12);
  margin: 14px 0 10px;
}

.legal{
  display:flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content:center;
  color:#64748b;
  font-size: 12px;
}

/* Responsive */
@media (max-width: 420px){
  .card{padding:18px; border-radius:18px}
  .titles h1{font-size:20px}
}
</style>
  