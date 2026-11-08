<script setup>
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SiteLogin from './components/SiteLogin.vue'

const savedRole = sessionStorage.getItem('savory-site-access')
const role = ref(savedRole === 'admin' || savedRole === 'guest' ? savedRole : '')
const loginVisible = computed(() => !role.value)

function setRole(nextRole) {
  role.value = nextRole
}

function logout() {
  sessionStorage.removeItem('savory-site-access')
  sessionStorage.removeItem('savory-admin-auth')
  role.value = ''
}
</script>

<template>
  <SiteLogin :show="loginVisible" @authenticated="setRole" />
  <AppHeader :role="role" @logout="logout" />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>
