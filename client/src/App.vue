<script setup>
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SiteLogin from './components/SiteLogin.vue'

const loginVisible = ref(false)
let pendingAction = null

provide('requestContactDetails', (action) => {
  pendingAction = action
  loginVisible.value = true
})

function saveContactDetails() {
  loginVisible.value = false
  const action = pendingAction
  pendingAction = null
  action?.()
}

function closeLogin() {
  loginVisible.value = false
  pendingAction = null
}

</script>

<template>
  <SiteLogin :show="loginVisible" @contact-collected="saveContactDetails" @close="closeLogin" />
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>
