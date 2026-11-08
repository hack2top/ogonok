<script setup>
import { RouterLink } from 'vue-router'
defineProps({ open: Boolean, role: String })
const emit = defineEmits(['close', 'denied'])

function adminUrl() {
  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    return 'http://127.0.0.1:5174/admin/'
  }
  return '/admin/'
}

function openAdmin(event) {
  if (event.currentTarget.dataset.guest === 'true') {
    event.preventDefault()
    emit('denied')
    emit('close')
  } else {
    emit('close')
  }
}
</script>

<template>
  <nav v-if="open" class="mobile-nav" aria-label="Mobile navigation">
    <RouterLink to="/" @click="$emit('close')">Home</RouterLink>
    <RouterLink to="/menu" @click="$emit('close')">Menu</RouterLink>
    <RouterLink to="/reservation" @click="$emit('close')">Reservations</RouterLink>
    <RouterLink to="/track" @click="$emit('close')">Track order</RouterLink>
    <RouterLink to="/cart" @click="$emit('close')">Cart</RouterLink>
    <a
      :href="role === 'admin' ? adminUrl() : '#'"
      :data-guest="role === 'guest' ? 'true' : 'false'"
      @click="openAdmin"
    >
      <span>Панель администратора</span>
      <span v-if="role === 'guest'" class="admin-lock">🔒</span>
    </a>
  </nav>
</template>
