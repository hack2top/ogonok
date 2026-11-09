<script setup>
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import SiteLogin from './components/SiteLogin.vue'

const loginVisible = ref(false)
const statusNotifications = ref([])
const syncError = ref('')
const knownStatuses = new Map()
const notificationTimers = new Map()
let pendingAction = null
let pollingTimer

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

function showStatusNotification(key, message) {
  const notification = { id: `${key}:${Date.now()}`, message }
  statusNotifications.value.push(notification)
  const timer = window.setTimeout(() => {
    statusNotifications.value = statusNotifications.value.filter(item => item.id !== notification.id)
    notificationTimers.delete(notification.id)
  }, 10000)
  notificationTimers.set(notification.id, timer)
}

async function refreshCustomerStatuses() {
  try {
    let profile = {}
    try { profile = JSON.parse(sessionStorage.getItem('savory-user-profile') || '{}') } catch { profile = {} }
    const email = String(profile.email || '').trim().toLowerCase()
    const phone = String(profile.phone || '').trim()
    if (!email || !phone) {
      syncError.value = ''
      return
    }

    const query = new URLSearchParams({ email, phone })
    const response = await fetch(`/api/customer-status?${query}`)
    if (!response.ok) throw new Error('Could not fetch current statuses.')
    const records = await response.json()
    syncError.value = ''

    for (const [type, initialStatus, describeStatus] of [
      ['order', 'New', status => ({
        New: 'Заказ принят.',
        Preparing: 'Ваш заказ готовится.',
        Ready: 'Ваш заказ готов.',
        Delivered: 'Заказ доставлен.',
        Cancelled: 'Заказ отменён.',
      }[status] || `Статус заказа: ${status}.`)],
      ['reservation', 'Pending', status => ({
        Pending: 'Бронирование ожидает подтверждения.',
        Confirmed: 'Ваш столик подтверждён.',
        Seated: 'Для вас подготовлен столик.',
        Completed: 'Бронирование завершено.',
        Cancelled: 'Бронирование отменено.',
      }[status] || `Статус бронирования: ${status}.`)],
    ]) {
      for (const record of records.filter(item => item.type === type)) {
        const key = `${type}:${record.id}`
        const previousStatus = knownStatuses.get(key)
        if (previousStatus !== record.status && (previousStatus !== undefined || record.status !== initialStatus)) {
          showStatusNotification(key, describeStatus(record.status))
        }
        knownStatuses.set(key, record.status)
      }
    }
  } catch (error) {
    console.error('Unable to refresh order and reservation statuses:', error)
    syncError.value = 'Не удалось обновить статусы. Проверьте подключение к сайту.'
  }
}

onMounted(() => {
  refreshCustomerStatuses()
  pollingTimer = window.setInterval(refreshCustomerStatuses, 3000)
})

onBeforeUnmount(() => {
  window.clearInterval(pollingTimer)
  for (const timer of notificationTimers.values()) window.clearTimeout(timer)
})

</script>

<template>
  <SiteLogin :show="loginVisible" @contact-collected="saveContactDetails" @close="closeLogin" />
  <div class="customer-status-notifications" aria-live="polite">
    <p v-if="syncError" class="customer-status-error">{{ syncError }}</p>
    <div v-for="notification in statusNotifications" :key="notification.id" class="customer-status-notice">
      <span>{{ notification.message }}</span>
      <button type="button" aria-label="Закрыть уведомление" @click="statusNotifications = statusNotifications.filter(item => item.id !== notification.id)">×</button>
    </div>
  </div>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>
