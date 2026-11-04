<script setup>
import { RouterLink } from 'vue-router'
defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<template>
  <nav v-if="open" class="mobile-nav" aria-label="Mobile navigation">
    <RouterLink to="/" @click="$emit('close')">Home</RouterLink>
    <RouterLink to="/menu" @click="$emit('close')">Menu</RouterLink>
    <RouterLink to="/reservation" @click="$emit('close')">Reservations</RouterLink>
    <RouterLink to="/track" @click="$emit('close')">Track order</RouterLink>
    <RouterLink to="/cart" @click="$emit('close')">Cart</RouterLink>
  </nav>
</template>
