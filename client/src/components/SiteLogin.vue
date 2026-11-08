<script setup>
import { ref } from 'vue'

defineProps({ show: Boolean })
const emit = defineEmits(['authenticated'])

const username = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)

function submit() {
  const login = username.value.trim().toLowerCase()

  if (login === 'admin' && password.value === 'hack2top1mira') {
    sessionStorage.setItem('savory-site-access', 'admin')
    sessionStorage.setItem('savory-admin-auth', 'true')
    emit('authenticated', 'admin')
    return
  }

  if (login === 'guest' && password.value === 'guest123') {
    sessionStorage.setItem('savory-site-access', 'guest')
    emit('authenticated', 'guest')
    return
  }

  error.value = 'Неверный логин или пароль.'
}
</script>

<template>
  <div v-if="show" class="site-login-overlay">
    <form class="site-login-card" @submit.prevent="submit">
      <div class="login-brand-small"><span>S</span><div><strong>SAVORY</strong><small>MEMBER ACCESS</small></div></div>
      <p class="site-login-eyebrow">Добро пожаловать</p>
      <h1>Войдите на сайт</h1>
      <label>Логин<input v-model="username" type="text" autocomplete="username" required autofocus placeholder="Введите логин" /></label>
      <label>Пароль<span class="site-password"><input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required placeholder="Введите пароль" /><button type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Скрыть' : 'Показать' }}</button></span></label>
      <p v-if="error" class="site-login-error">{{ error }}</p>
      <button class="site-login-button" type="submit">Войти</button>
      <div class="guest-credentials"><span>Обычный доступ</span><p>Логин: <b>guest</b><br />Пароль: <b>guest123</b></p></div>
    </form>
  </div>
</template>
