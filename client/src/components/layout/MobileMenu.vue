<script setup>
import { RouterLink } from 'vue-router'
defineProps({ open: Boolean, role: String })
defineEmits(['close'])

function adminUrl() {
  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    return 'http://127.0.0.1:5174/admin/'
  }
  return '/admin/'
}
</script>

<template>
  <nav v-if="open" class="mobile-nav" aria-label="Mobile navigation">
    <RouterLink to="/" @click="$emit('close')">Home</RouterLink>
    <RouterLink to="/menu" @click="$emit('close')">Menu</RouterLink>
    <RouterLink to="/reservation" @click="$emit('close')">Reservations</RouterLink>
    <RouterLink to="/track" @click="$emit('close')">Track order</RouterLink>
    <RouterLink to="/cart" @click="$emit('close')">Cart</RouterLink>
    <a v-if="role === 'admin'" :href="adminUrl()" @click="$emit('close')">Панель администратора</a>
  </nav>
</template>
