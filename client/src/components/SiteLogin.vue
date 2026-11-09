<script setup>
import { ref } from 'vue'

defineProps({ show: Boolean })
const emit = defineEmits(['contact-collected', 'close'])

const savedProfile = (() => {
  try { return JSON.parse(sessionStorage.getItem('savory-user-profile') || '{}') } catch { return {} }
})()
const email = ref(savedProfile.email || '')
const phone = ref(savedProfile.phone || '')

function submit() {
  const profile = {
    email: email.value.trim().toLowerCase(),
    phone: phone.value.trim(),
  }
  sessionStorage.setItem('savory-user-profile', JSON.stringify(profile))
  emit('contact-collected', profile)
}
</script>

<template>
  <div v-if="show" class="site-login-overlay" role="dialog" aria-modal="true" aria-labelledby="site-login-title">
    <form class="site-login-card" @submit.prevent="submit">
      <button class="site-login-close" type="button" aria-label="Закрыть" @click="emit('close')">×</button>
      <div class="login-brand-small"><span>S</span><div><strong>SAVORY</strong><small>ORDER CONTACT</small></div></div>
      <p class="site-login-eyebrow">Контактные данные</p>
      <h1 id="site-login-title">Для оформления заказа</h1>
      <label>E-mail<input v-model="email" type="email" autocomplete="email" required autofocus placeholder="name@example.com" /></label>
      <label>Номер телефона<input v-model="phone" type="tel" autocomplete="tel" required placeholder="+998 90 123 45 67" /></label>
      <button class="site-login-button" type="submit">Продолжить</button>
    </form>
  </div>
</template>
