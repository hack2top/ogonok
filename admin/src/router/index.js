import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminMenuView from '../views/AdminMenuView.vue'
import AdminManagementView from '../views/AdminManagementView.vue'
import EmployeeManagementView from '../views/EmployeeManagementView.vue'
import LoginView from '../views/LoginView.vue'

const routesByRole = {
  chef: ['/menu'],
  courier: ['/orders'],
}

function isRouteAllowed(role, path) {
  return !routesByRole[role] || routesByRole[role].includes(path)
}

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
    { path: '/employees', name: 'employees', component: EmployeeManagementView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach(async (to) => {
  let authenticated = sessionStorage.getItem('savory-admin-auth') === 'true'
  let session = null
  if (authenticated) {
    try {
      const response = await fetch('/api/admin/session')
      session = response.ok ? await response.json() : { authenticated: false }
      authenticated = session.authenticated === true
    } catch {
      authenticated = false
    }
    if (authenticated) {
      sessionStorage.setItem('savory-admin-role', session.role)
      sessionStorage.setItem('savory-admin-username', session.username)
    } else {
      sessionStorage.removeItem('savory-admin-auth')
      sessionStorage.removeItem('savory-admin-role')
      sessionStorage.removeItem('savory-admin-username')
    }
  }
  if (to.meta.requiresAuth && !authenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (authenticated && to.name === 'login') {
    const role = sessionStorage.getItem('savory-admin-role')
    return { path: role === 'chef' ? '/menu' : role === 'courier' ? '/orders' : '/' }
  }
  if (authenticated && to.meta.requiresAuth && !isRouteAllowed(sessionStorage.getItem('savory-admin-role'), to.path)) {
    const role = sessionStorage.getItem('savory-admin-role')
    return { path: role === 'chef' ? '/menu' : '/orders' }
  }
})

export default router
