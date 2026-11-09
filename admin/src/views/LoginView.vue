<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const username = ref('')
const password = ref('')
const email = ref('')
const phone = ref('')
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
        email: email.value,
        phone: phone.value,
      }),
    })
    if (!response.ok) throw new Error('Incorrect administrator credentials.')
    sessionStorage.setItem('savory-admin-auth', 'true')
    const redirect = route.query.redirect || '/'
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
        <div><strong>SAVORY</strong><small>ADMIN PORTAL</small></div>
      </div>
      <div class="login-heading">
        <p>Welcome back</p>
        <h1>Sign in to manage your restaurant</h1>
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
      <label>E-mail<input v-model="email" type="email" autocomplete="email" required placeholder="hzuhra34@gmail.com" /></label>
      <label>Phone number<input v-model="phone" type="tel" autocomplete="tel" required placeholder="+998 50 156 72 43" /></label>
      <p v-if="error" class="login-error">{{ error }}</p>
      <button class="login-button" type="submit">Sign in</button>
    </form>
  </main>
</template>
