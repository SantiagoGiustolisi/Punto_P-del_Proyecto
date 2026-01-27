// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// vistas (por ahora las creamos después)
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
