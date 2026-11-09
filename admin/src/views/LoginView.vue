<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)

async function login() {
  error.value = ''
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
    if (!response.ok) throw new Error('Incorrect administrator credentials.')
    const session = await response.json()
    if (!session.role || !session.username) throw new Error('Invalid HR session response.')
    sessionStorage.setItem('savory-admin-auth', 'true')
    sessionStorage.setItem('savory-admin-role', session.role)
    sessionStorage.setItem('savory-admin-username', session.username)
    const defaultRoute = session.role === 'chef' ? '/menu' : session.role === 'courier' ? '/orders' : '/'
    const redirect = route.query.redirect || defaultRoute
    router.replace(String(redirect))
  } catch (loginError) {
    console.error('Administrator sign-in failed:', loginError)
    error.value = 'Incorrect credentials or the admin service is unavailable.'
  }
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit.prevent="login">
      <div class="login-brand">
        <span>S</span>
        <div><strong>SAVORY</strong><small>HR PORTAL</small></div>
      </div>
      <div class="login-heading">
        <p>Welcome back</p>
        <h1>Вход в HR-панель</h1>
      </div>
      <label>
        Username
        <input v-model="username" type="text" autocomplete="username" required placeholder="Enter username" autofocus />
      </label>
      <label>
        Password
        <span class="password-field">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required placeholder="Enter password" />
          <button type="button" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </span>
      </label>
      <p v-if="error" class="login-error">{{ error }}</p>
      <button class="login-button" type="submit">Войти</button>
    </form>
  </main>
</template>
