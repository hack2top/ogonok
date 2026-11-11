<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { languages, locale, setLocale, setTheme, t, theme } from './i18n'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const user = ref({
  username: sessionStorage.getItem('savory-admin-username') || '',
  displayName: '',
  role: sessionStorage.getItem('savory-admin-role') || '',
  roleName: '',
})
const roleLabels = {
  creator: 'creator',
  chef: 'chef',
  courier: 'courier',
  admin: 'admin',
  analyst: 'analyst',
}
const navItems = [
  { path: '/', label: 'dashboard', icon: 'grid' },
  { path: '/orders', label: 'orders', icon: 'bag' },
  { path: '/menu', label: 'menu', icon: 'menu' },
  { path: '/reservations', label: 'reservations', icon: 'calendar' },
  { path: '/customers', label: 'customers', icon: 'users' },
  { path: '/analytics', label: 'analytics', icon: 'chart' },
  { path: '/employees', label: 'hr', icon: 'users' },
  { path: '/settings', label: 'settings', icon: 'settings' },
]
const limitedRoutes = computed(() => user.value.role === 'chef'
  ? ['/menu', '/orders']
  : user.value.role === 'courier'
    ? ['/orders']
    : null)
const visibleNavItems = computed(() => navItems.filter(item => !limitedRoutes.value || limitedRoutes.value.includes(item.path)))
const pageTitle = computed(() => t(navItems.find(item => item.path === route.path)?.label || 'dashboard'))

function updateUser(session) {
  user.value = {
    username: session.username || '',
    displayName: session.displayName || '',
    role: session.role || '',
    roleName: roleLabels[session.role] ? t(roleLabels[session.role]) : session.roleName || '',
  }
}

function onSessionUpdated(event) {
  updateUser(event.detail)
}

onMounted(async () => {
  window.addEventListener('savory-admin-session-updated', onSessionUpdated)
  try {
    const response = await fetch('/api/admin/session')
    if (!response.ok) throw new Error('Could not load employee session.')
    const session = await response.json()
    if (!session.authenticated) {
      user.value = { username: '', displayName: '', role: '', roleName: '' }
      sessionStorage.removeItem('savory-admin-auth')
      sessionStorage.removeItem('savory-admin-role')
      sessionStorage.removeItem('savory-admin-username')
      return
    }
    updateUser(session)
  } catch (error) {
    console.error('Unable to load HR session:', error)
  }
})

onBeforeUnmount(() => window.removeEventListener('savory-admin-session-updated', onSessionUpdated))

async function logout() {
  try {
    const response = await fetch('/api/admin/session', { method: 'DELETE' })
    if (!response.ok) throw new Error('Could not end HR session.')
  } catch (error) {
    console.error('Unable to end HR session:', error)
  } finally {
    user.value = { username: '', displayName: '', role: '', roleName: '' }
    sessionStorage.removeItem('savory-admin-auth')
    sessionStorage.removeItem('savory-admin-role')
    sessionStorage.removeItem('savory-admin-username')
    router.replace('/login')
  }
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
        <span><strong>SAVORY</strong><small>HR</small></span>
      </RouterLink>

      <nav class="side-nav" aria-label="Admin navigation">
        <p class="nav-label">{{ t('workspace') }}</p>
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          @click="sidebarOpen = false"
        >
          <span class="nav-icon" :class="`icon-${item.icon}`"></span>
          <span>{{ t(item.label) }}</span>
          <b v-if="item.count">{{ item.count }}</b>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="admin-profile">
          <div class="avatar">{{ user.username.slice(0, 2).toUpperCase() }}</div>
          <div><strong>{{ user.displayName || user.username }}</strong><small>{{ roleLabels[user.role] ? t(roleLabels[user.role]) : user.roleName }}</small></div>
          <button class="logout-button" :aria-label="t('logout')" :title="t('logout')" @click="logout">↗</button>
        </div>
      </div>
    </aside>

    <button class="sidebar-backdrop" :class="{ visible: sidebarOpen }" :aria-label="t('closeMenu')" @click="sidebarOpen = false"></button>

    <main class="admin-main">
      <header class="topbar">
        <button class="return-site-button" type="button" @click="returnToSite">{{ t('returnSite') }}</button>
        <button class="mobile-menu" :aria-label="t('openMenu')" @click="sidebarOpen = true"><span></span><span></span></button>
        <div>
          <p>{{ t('restaurant') }}</p>
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="topbar-actions">
          <label class="search-box">
            <span></span>
            <input type="search" :placeholder="t('search')" :aria-label="t('search')" />
            <kbd>⌘ K</kbd>
          </label>
          <label class="admin-language">
            <span class="sr-only">{{ t('language') }}</span>
            <select :value="locale" :aria-label="t('language')" @change="setLocale($event.target.value)">
              <option v-for="language in languages" :key="language.value" :value="language.value">{{ language.label }}</option>
            </select>
          </label>
          <button class="admin-theme-toggle" type="button" :aria-label="theme === 'dark' ? t('light') : t('dark')" :title="theme === 'dark' ? t('light') : t('dark')" @click="setTheme(theme === 'dark' ? 'light' : 'dark')">{{ theme === 'dark' ? '☀' : '☾' }}</button>
          <div class="top-avatar">{{ user.username.slice(0, 2).toUpperCase() }}</div>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>
