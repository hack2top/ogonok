<script setup>
import { ref } from 'vue'

defineProps({ show: Boolean })
const emit = defineEmits(['authenticated', 'close'])

const username = ref('')
const password = ref('')
const email = ref('')
const phone = ref('')
const error = ref('')
const showPassword = ref(false)

function submit() {
  const login = username.value.trim().toLowerCase()
  const profile = {
    email: email.value.trim().toLowerCase(),
    phone: phone.value.trim(),
    name: login === 'admin' ? 'Zuhra Mirzaeva' : 'Guest'
  }

  if (login === 'admin' && password.value === 'hack2top1mira') {
    if (profile.email !== 'hzuhra34@gmail.com' || profile.phone !== '+998 50 156 72 43') {
      error.value = 'Для аккаунта администратора нужны указанные e-mail и номер телефона.'
      return
    }
    sessionStorage.setItem('savory-site-access', 'admin')
    sessionStorage.setItem('savory-admin-auth', 'true')
    sessionStorage.setItem('savory-user-profile', JSON.stringify(profile))
    emit('authenticated', 'admin')
    return
  }

  if (login === 'guest' && password.value === 'guest123') {
    sessionStorage.setItem('savory-site-access', 'guest')
    sessionStorage.setItem('savory-user-profile', JSON.stringify(profile))
    emit('authenticated', 'guest')
    return
  }

  error.value = 'Неверный логин или пароль.'
}
</script>

<template>
  <div v-if="show" class="site-login-overlay" role="dialog" aria-modal="true" aria-labelledby="site-login-title">
    <form class="site-login-card" @submit.prevent="submit">
      <button class="site-login-close" type="button" aria-label="Закрыть" @click="emit('close')">×</button>
      <div class="login-brand-small"><span>S</span><div><strong>SAVORY</strong><small>MEMBER ACCESS</small></div></div>
      <p class="site-login-eyebrow">Для оформления заказа</p>
      <h1 id="site-login-title">Войдите в аккаунт</h1>
      <label>Логин<input v-model="username" type="text" autocomplete="username" required autofocus placeholder="Введите логин" /></label>
      <label>Пароль<span class="site-password"><input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required placeholder="Введите пароль" /><button type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Скрыть' : 'Показать' }}</button></span></label>
      <label>E-mail<input v-model="email" type="email" autocomplete="email" required placeholder="name@example.com" /></label>
      <label>Номер телефона<input v-model="phone" type="tel" autocomplete="tel" required placeholder="+998 90 123 45 67" /></label>
      <p v-if="error" class="site-login-error">{{ error }}</p>
      <button class="site-login-button" type="submit">Войти и продолжить</button>
      <div class="guest-credentials"><span>Обычный доступ</span><p>Логин: <b>guest</b><br />Пароль: <b>guest123</b></p></div>
    </form>
  </div>
</template>
