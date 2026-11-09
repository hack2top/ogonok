<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const navItems = [
  { path: '/', label: 'Dashboard', icon: 'grid' },
  { path: '/orders', label: 'Orders', icon: 'bag', count: 8 },
  { path: '/menu', label: 'Menu', icon: 'menu' },
  { path: '/reservations', label: 'Reservations', icon: 'calendar' },
  { path: '/customers', label: 'Customers', icon: 'users' },
  { path: '/analytics', label: 'Analytics', icon: 'chart' },
]
const pageTitle = computed(() => navItems.find(item => item.path === route.path)?.label || 'Dashboard')

function logout() {
  fetch('/api/admin/session', { method: 'DELETE' }).catch(error => {
    console.error('Unable to end administrator session:', error)
  })
  sessionStorage.removeItem('savory-admin-auth')
  router.replace('/login')
}

function returnToSite() {
  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    window.location.href = 'http://127.0.0.1:5173/'
  } else {
    window.location.href = '/'
  }
}
</script>

<template>
  <RouterView v-if="route.name === 'login'" />
  <div v-else class="admin-shell">
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <RouterLink class="admin-brand" to="/" @click="sidebarOpen = false">
        <span class="brand-mark">S</span>
        <span><strong>SAVORY</strong><small>ADMIN</small></span>
      </RouterLink>

      <nav class="side-nav" aria-label="Admin navigation">
        <p class="nav-label">Workspace</p>
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          @click="sidebarOpen = false"
        >
          <span class="nav-icon" :class="`icon-${item.icon}`"></span>
          <span>{{ item.label }}</span>
          <b v-if="item.count">{{ item.count }}</b>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <RouterLink to="/settings" class="nav-item"><span class="nav-icon icon-settings"></span><span>Settings</span></RouterLink>
        <div class="admin-profile">
          <div class="avatar">AC</div>
          <div><strong>Alex Chen</strong><small>Administrator</small></div>
          <button class="logout-button" aria-label="Log out" title="Log out" @click="logout">↗</button>
        </div>
      </div>
    </aside>

    <button class="sidebar-backdrop" :class="{ visible: sidebarOpen }" aria-label="Close menu" @click="sidebarOpen = false"></button>

    <main class="admin-main">
      <header class="topbar">
        <button class="return-site-button" type="button" @click="returnToSite">← Вернуться на сайт</button>
        <button class="mobile-menu" aria-label="Open menu" @click="sidebarOpen = true"><span></span><span></span></button>
        <div>
          <p>Restaurant overview</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-actions">
          <label class="search-box">
            <span></span>
            <input type="search" placeholder="Search orders..." aria-label="Search orders" />
            <kbd>⌘ K</kbd>
          </label>
          <button class="notification-button" aria-label="Notifications"><span></span></button>
          <div class="top-avatar">AC</div>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>
