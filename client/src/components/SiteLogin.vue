<script setup>
import { ref } from 'vue'
import { t } from '../i18n'

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
      <button class="site-login-close" type="button" :aria-label="t('closeMenu')" @click="emit('close')">×</button>
      <div class="login-brand-small"><span>S</span><div><strong>SAVORY</strong><small>{{ t('orderContact') }}</small></div></div>
      <p class="site-login-eyebrow">{{ t('contactDetails') }}</p>
      <h1 id="site-login-title">{{ t('orderContactTitle') }}</h1>
      <label>{{ t('emailLabel') }}<input v-model="email" type="email" autocomplete="email" required autofocus placeholder="name@example.com" /></label>
      <label>{{ t('phoneNumber') }}<input v-model="phone" type="tel" autocomplete="tel" required placeholder="+998 90 123 45 67" /></label>
      <button class="site-login-button" type="submit">{{ t('continue') }}</button>
    </form>
  </div>
</template>
