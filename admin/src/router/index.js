import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminMenuView from '../views/AdminMenuView.vue'
import AdminManagementView from '../views/AdminManagementView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    { path: '/orders', name: 'orders', component: AdminManagementView, meta: { requiresAuth: true } },
    { path: '/menu', name: 'menu', component: AdminMenuView, meta: { requiresAuth: true } },
    { path: '/reservations', name: 'reservations', component: AdminManagementView, meta: { requiresAuth: true } },
    { path: '/customers', name: 'customers', component: AdminManagementView, meta: { requiresAuth: true } },
    { path: '/analytics', name: 'analytics', component: AdminManagementView, meta: { requiresAuth: true } },
    { path: '/settings', name: 'settings', component: AdminManagementView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const authenticated = sessionStorage.getItem('savory-admin-auth') === 'true'
  if (to.meta.requiresAuth && !authenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && authenticated) return { path: '/' }
})

export default router
