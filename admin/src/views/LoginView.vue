<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { languages, locale, setLocale, setTheme, t, theme } from '../i18n'

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
    window.dispatchEvent(new CustomEvent('savory-admin-session-updated', { detail: session }))
    const defaultRoute = session.role === 'chef' ? '/menu' : session.role === 'courier' ? '/orders' : '/'
    const redirect = route.query.redirect || defaultRoute
    router.replace(String(redirect))
  } catch (loginError) {
    console.error('Administrator sign-in failed:', loginError)
    error.value = 'invalidLogin'
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-preferences">
      <label>
        <span class="sr-only">{{ t('language') }}</span>
        <select :value="locale" :aria-label="t('language')" @change="setLocale($event.target.value)">
          <option v-for="language in languages" :key="language.value" :value="language.value">{{ language.label }}</option>
        </select>
      </label>
      <button type="button" :aria-label="theme === 'dark' ? t('light') : t('dark')" @click="setTheme(theme === 'dark' ? 'light' : 'dark')">{{ theme === 'dark' ? '☀' : '☾' }}</button>
    </div>
    <form class="login-card" @submit.prevent="login">
      <div class="login-brand">
        <span>S</span>
        <div><strong>SAVORY</strong><small>HR PORTAL</small></div>
      </div>
      <div class="login-heading">
        <p>{{ t('loginWelcome') }}</p>
        <h1>{{ t('loginTitle') }}</h1>
      </div>
      <label>
        {{ t('username') }}
        <input v-model="username" type="text" autocomplete="username" required :placeholder="t('enterUsername')" autofocus />
      </label>
      <label>
        {{ t('password') }}
        <span class="password-field">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required :placeholder="t('enterPassword')" />
          <button type="button" :aria-label="showPassword ? t('hide') : t('show')" @click="showPassword = !showPassword">
            {{ showPassword ? t('hide') : t('show') }}
          </button>
        </span>
      </label>
      <p v-if="error" class="login-error">{{ t(error) }}</p>
      <button class="login-button" type="submit">{{ t('signIn') }}</button>
    </form>
  </main>
</template>
