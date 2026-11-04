import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/orders', name: 'orders', component: HomeView },
    { path: '/menu', name: 'menu', component: HomeView },
    { path: '/reservations', name: 'reservations', component: HomeView },
    { path: '/customers', name: 'customers', component: HomeView },
    { path: '/analytics', name: 'analytics', component: HomeView },
    { path: '/settings', name: 'settings', component: HomeView },
  ],
})

export default router
