import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminMenuView from '../views/AdminMenuView.vue'
import AdminManagementView from '../views/AdminManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    { path: '/orders', name: 'orders', component: AdminManagementView },
    { path: '/menu', name: 'menu', component: AdminMenuView },
    { path: '/reservations', name: 'reservations', component: AdminManagementView },
    { path: '/customers', name: 'customers', component: AdminManagementView },
    { path: '/analytics', name: 'analytics', component: AdminManagementView },
    { path: '/settings', name: 'settings', component: AdminManagementView },
  ],
})

export default router
