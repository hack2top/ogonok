<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import MobileMenu from './MobileMenu.vue'

const menuOpen = ref(false)
const props = defineProps({ role: String })
const emit = defineEmits(['logout'])
const accessDenied = ref(false)

function adminUrl() {
  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    return 'http://127.0.0.1:5174/admin/'
  }
  return '/admin/'
}

function openAdmin(event) {
  if (props.role !== 'admin') {
    event.preventDefault()
    accessDenied.value = true
    return
  }
  window.location.href = adminUrl()
}

function closeAccessDenied() {
  accessDenied.value = false
}
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Savory home">
      <span class="brand-mark">S</span>
      <span>SAVORY<span class="brand-dot">.</span></span>
    </RouterLink>

    <nav class="desktop-nav" aria-label="Main navigation">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/menu">Menu</RouterLink>
      <RouterLink to="/reservation">Reservations</RouterLink>
      <RouterLink to="/track">Track order</RouterLink>
      <button class="admin-nav-link guest-admin-button" type="button" @click="openAdmin">
        <span>Панель администратора</span>
        <span v-if="role === 'guest'" class="admin-lock" aria-label="Доступ закрыт">🔒</span>
      </button>
    </nav>

    <div class="header-actions">
      <span v-if="role" class="site-role" :class="role">{{ role === 'admin' ? 'Администратор' : 'Гость' }}</span>
      <button v-if="role" class="site-logout" type="button" @click="emit('logout')">Выйти</button>
      <RouterLink class="icon-button" to="/cart" aria-label="Shopping cart">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6m4 12a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/></svg>
        <span>Cart</span>
      </RouterLink>
      <RouterLink class="button button-small" to="/reservation">Book a table</RouterLink>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
        <span></span><span></span>
      </button>
    </div>
    <MobileMenu :open="menuOpen" :role="role" @close="menuOpen = false" @denied="accessDenied = true" />

    <div v-if="accessDenied" class="admin-access-modal" role="dialog" aria-modal="true" aria-label="Нет доступа">
      <div class="admin-access-card">
        <span class="admin-access-lock">🔒</span>
        <h2>Нет доступа к админ-панели</h2>
        <p>Эта панель доступна только пользователю со статусом «Администратор».</p>
        <button type="button" @click="closeAccessDenied">Понятно</button>
      </div>
    </div>
  </header>
</template>
