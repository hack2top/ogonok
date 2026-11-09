<script setup>
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SiteLogin from './components/SiteLogin.vue'

const savedRole = sessionStorage.getItem('savory-site-access')
const role = ref(savedRole === 'admin' || savedRole === 'guest' ? savedRole : '')
const loginVisible = ref(false)
let pendingAction = null

provide('requestSiteAuthentication', (action) => {
  pendingAction = action
  loginVisible.value = true
})

function setRole(nextRole) {
  role.value = nextRole
  loginVisible.value = false
  const action = pendingAction
  pendingAction = null
  action?.()
}

function closeLogin() {
  loginVisible.value = false
  pendingAction = null
}

function logout() {
  sessionStorage.removeItem('savory-site-access')
  sessionStorage.removeItem('savory-admin-auth')
  role.value = ''
}
</script>

<template>
  <SiteLogin :show="loginVisible" @authenticated="setRole" @close="closeLogin" />
  <AppHeader :role="role" @logout="logout" />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>
