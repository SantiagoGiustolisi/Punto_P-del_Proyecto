import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Canchas from "../views/Canchas.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/canchas", name: "canchas", component: Canchas },

  // placeholders para no romper los botones (después las hacemos)
  { path: "/canchas/:id", name: "cancha-detalle", component: Home },
  { path: "/reservar", name: "reservar", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
