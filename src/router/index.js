// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// Vistas reales
import Home from "../views/Home.vue";
import Canchas from "../views/Canchas.vue";
import Login from "../views/Login.vue";

// (Opcional) Si más adelante creás estas vistas, reemplazás los placeholders.
// import CanchaDetalle from "../views/CanchaDetalle.vue";
// import Reservar from "../views/Reservar.vue";

const routes = [
  // Entrada del sitio => Login
  { path: "/", redirect: "/login" },

  // Login
  { path: "/login", name: "login", component: Login },

  // Home (protegida)
  { path: "/home", name: "home", component: Home },

  // Canchas (protegida)
  { path: "/canchas", name: "canchas", component: Canchas },

  // Placeholders para no romper botones (por ahora apuntan a Home)
  { path: "/canchas/:id", name: "cancha-detalle", component: Home },
  { path: "/reservar", name: "reservar", component: Home },

  // Si cae en cualquier ruta desconocida:
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Guard simple de autenticación (DEMO)
 * - Si no hay sesión, no deja entrar a rutas protegidas
 * - Si ya hay sesión, no deja volver a /login
 *
 * ¿Dónde está la sesión?
 * - La guardamos en localStorage como "pp_session" desde Login.vue
 */
router.beforeEach((to) => {
  const session = localStorage.getItem("pp_session");
  const isLogged = !!session;

  // Rutas públicas
  const publicRoutes = ["/login"];
  const isPublic = publicRoutes.includes(to.path);

  // Si NO está logueado y quiere ir a una ruta NO pública => login
  if (!isLogged && !isPublic) {
    return "/login";
  }

  // Si está logueado y quiere ir a login => home
  if (isLogged && to.path === "/login") {
    return "/home";
  }

  // seguir normal
  return true;
});

export default router;
