<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const showPassword = ref(false)

function login() {
  if (username.value.trim().toLowerCase() === 'admin' && password.value === 'hack2top1mira') {
    sessionStorage.setItem('savory-admin-auth', 'true')
    const redirect = route.query.redirect || '/'
    router.replace(String(redirect))
  } else {
    error.value = 'Incorrect username or password.'
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
      <p v-if="error" class="login-error">{{ error }}</p>
      <button class="login-button" type="submit">Sign in</button>
    </form>
  </main>
</template>
