<script setup>
import { RouterLink } from 'vue-router'
import { t } from '../../i18n'
defineProps({ open: Boolean })
</script>

<template>
  <nav v-if="open" class="mobile-nav" aria-label="Mobile navigation">
    <RouterLink to="/" @click="$emit('close')">{{ t('home') }}</RouterLink>
    <RouterLink to="/menu" @click="$emit('close')">{{ t('menu') }}</RouterLink>
    <RouterLink to="/reservation" @click="$emit('close')">{{ t('reservations') }}</RouterLink>
    <RouterLink to="/track" @click="$emit('close')">{{ t('track') }}</RouterLink>
    <RouterLink to="/cart" @click="$emit('close')">{{ t('cart') }}</RouterLink>
  </nav>
</template>
