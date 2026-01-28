import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Canchas from "../views/Canchas.vue";
import Reservar from "../views/Reservar.vue";
import MisReservas from "../views/MisReservas.vue";
import Login from "../views/Login.vue";

const routes = [
  // Login (pública)
  { path: "/login", name: "login", component: Login },

  // App (protegidas)
  { path: "/", name: "home", component: Home },
  { path: "/canchas", name: "canchas", component: Canchas },
  { path: "/reservar", name: "reservar", component: Reservar },
  { path: "/mis-reservas", name: "mis-reservas", component: MisReservas },

  // fallback
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  // ✅ elegí UNA sola variable para auth:
  // Si tu login guarda "pp_session", dejalo así.
  // Si guarda token, cambiá a "pp_token".
  const session = localStorage.getItem("pp_session");
  const isLogged = !!session;

  const publicRoutes = ["login"];
  const isPublic = publicRoutes.includes(to.name);

  if (!isLogged && !isPublic) {
    return { name: "login" };
  }

  if (isLogged && to.name === "login") {
    return { name: "home" }; // ✅ existe
  }

  return true;
});

export default router;
