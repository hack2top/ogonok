<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '../i18n'

const route = useRoute()
const section = computed(() => route.path)
const orderSearch = ref('')
const orderStatus = ref('All')
const reservationSearch = ref('')
const customerSearch = ref('')
const reservationStatus = ref('All')
const selectedDate = ref('')
const orderStatuses = ['New', 'Preparing', 'Ready', 'Delivered', 'Cancelled']
const currentRole = sessionStorage.getItem('savory-admin-role')
const canViewReservations = ['business', 'admin', 'analyst'].includes(currentRole)
const canEditOrders = ['business', 'admin', 'courier'].includes(currentRole)

const orders = ref([])
const reservations = ref([])
const analytics = ref(null)
const analyticsError = ref('')
const selectedAnalyticsRange = ref(7)
let sharedDataTimer
let disposed = false

async function initializeSharedData() {
  try {
    const orderResponse = await fetch('/api/orders')
    if (!orderResponse.ok) throw new Error('Could not load shared orders.')
    orders.value = await orderResponse.json()

    if (canViewReservations) {
      const reservationResponse = await fetch('/api/reservations')
      if (!reservationResponse.ok) throw new Error('Could not load shared reservations.')
      reservations.value = await reservationResponse.json()
    }
    if (section.value === '/analytics') await refreshAnalytics()
  } catch (error) {
    console.error('Unable to synchronize admin data:', error)
    window.alert('Не удалось подключиться к общим данным. Запустите сайт через команду npm start.')
  }
}
async function refreshSharedData() {
  try {
    const orderResponse = await fetch('/api/orders')
    if (!orderResponse.ok) throw new Error('Could not refresh shared orders.')
    const sharedOrders = await orderResponse.json()
    if (JSON.stringify(orders.value) !== JSON.stringify(sharedOrders)) orders.value = sharedOrders
    if (canViewReservations) {
      const reservationResponse = await fetch('/api/reservations')
      if (!reservationResponse.ok) throw new Error('Could not refresh shared reservations.')
      const sharedReservations = await reservationResponse.json()
      if (JSON.stringify(reservations.value) !== JSON.stringify(sharedReservations)) reservations.value = sharedReservations
    }
    if (section.value === '/analytics') await refreshAnalytics()
  } catch (error) {
    console.error('Unable to refresh admin data:', error)
  }
}

async function refreshAnalytics() {
  try {
    const response = await fetch('/api/analytics')
    if (!response.ok) throw new Error('Could not load analytics.')
    analytics.value = await response.json()
    analyticsError.value = ''
  } catch (error) {
    console.error('Unable to load analytics:', error)
    analyticsError.value = 'dashboardLoadError'
  }
}

onBeforeUnmount(() => {
  disposed = true
  window.clearInterval(sharedDataTimer)
})

const filteredOrders = computed(() => orders.value.filter(order =>
  (orderStatus.value === 'All' || order.status === orderStatus.value) &&
  (!orderSearch.value || `${order.id} ${order.customer}`.toLowerCase().includes(orderSearch.value.toLowerCase()))
))

const filteredReservations = computed(() => reservations.value.filter(item =>
  (reservationStatus.value === 'All' || item.status === reservationStatus.value) &&
  (!selectedDate.value || item.date === selectedDate.value) &&
  (!reservationSearch.value || `${item.customer} ${item.phone}`.toLowerCase().includes(reservationSearch.value.toLowerCase()))
))

const customers = computed(() => {
  const map = new Map()
  orders.value.forEach(order => {
    const existing = map.get(order.customer) || { name: order.customer, phone: order.phone, email: order.email || '', status: 'Business', orders: 0, spent: 0, lastOrder: order.date }
    existing.orders += 1
    existing.spent += order.amount
    if (order.date > existing.lastOrder) existing.lastOrder = order.date
    map.set(order.customer, existing)
  })
  reservations.value.forEach(item => {
    if (!map.has(item.customer)) map.set(item.customer, { name: item.customer, phone: item.phone, email: item.email || '', status: 'Business', orders: 0, spent: 0, lastOrder: item.date })
  })
  return [...map.values()]
})
const filteredCustomers = computed(() => customers.value.filter(customer =>
  !customerSearch.value ||
  `${customer.name} ${customer.phone}`.toLowerCase().includes(customerSearch.value.toLowerCase())
))

async function changeOrderStatus(order, status) {
  const previousStatus = order.status
  order.status = status
  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(order.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error('The order status could not be synchronized.')
    Object.assign(order, await response.json())
    window.dispatchEvent(new Event('savory-data-updated'))
    if (section.value === '/analytics') await refreshAnalytics()
  } catch (error) {
    order.status = previousStatus
    console.error('Unable to update order status:', error)
    window.alert('Не удалось обновить статус заказа. Проверьте подключение и повторите попытку.')
  }
}

async function changeReservationStatus(item, status) {
  const previousStatus = item.status
  item.status = status
  try {
    const response = await fetch(`/api/reservations/${encodeURIComponent(item.id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error('The reservation status could not be synchronized.')
  } catch (error) {
    item.status = previousStatus
    console.error('Unable to update reservation status:', error)
    window.alert('Не удалось обновить статус бронирования. Проверьте подключение и повторите попытку.')
  }
}

function formatMoney(amount) {
  return `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const todayReservations = computed(() => reservations.value.filter(item => item.date === new Date().toISOString().slice(0, 10) && item.status !== 'Cancelled').length)
const upcomingReservations = computed(() => reservations.value.filter(item => item.status !== 'Cancelled' && item.status !== 'Completed').length)
const upcomingGuests = computed(() => reservations.value.filter(item => item.status !== 'Cancelled').reduce((sum, item) => sum + Number(item.guests || 0), 0))
const analyticsChartData = computed(() => (analytics.value?.dailyRevenue || []).slice(-selectedAnalyticsRange.value))
const analyticsChartMaximum = computed(() => Math.max(1, ...analyticsChartData.value.map(day => day.amount)))
const repeatCustomerRate = computed(() => `${Number(analytics.value?.metrics.repeatCustomerRate || 0).toFixed(1)}%`)

function dayLabel(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'short' })
}

const settings = ref(JSON.parse(localStorage.getItem('savory-settings') || '{"name":"Savory","phone":"+998 90 123 45 67","email":"hello@savory.uz","address":"24 Tashkent Street","opening":"10:00","closing":"23:00"}'))
function saveSettings() {
  localStorage.setItem('savory-settings', JSON.stringify(settings.value))
  window.alert('Restaurant settings saved.')
}

initializeSharedData().then(() => {
  if (!disposed) sharedDataTimer = window.setInterval(refreshSharedData, 3000)
})
</script>

<template>
  <div class="management-page">
    <template v-if="section === '/orders'">
      <div class="management-toolbar">
        <label class="management-search"><span>⌕</span><input v-model="orderSearch" type="search" :placeholder="t('searchOrdersCustomers')" /></label>
        <div class="filter-buttons"><button v-for="status in ['All', ...orderStatuses]" :key="status" :class="{ active: orderStatus === status }" @click="orderStatus = status">{{ t(status === 'All' ? 'all' : status.toLowerCase()) }}</button></div>
      </div>
      <div class="panel data-panel">
        <div class="panel-heading"><div><p>{{ t('allActivity') }}</p><strong>{{ filteredOrders.length }} {{ t('orders').toLowerCase() }}</strong></div></div>
        <div class="table-wrap">
          <table class="management-table">
            <thead><tr><th>{{ t('order') }}</th><th>{{ t('customer') }}</th><th>{{ t('dateTime') }}</th><th>{{ t('type') }}</th><th>{{ t('items') }}</th><th>{{ t('total') }}</th><th>{{ t('status') }}</th></tr></thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td><strong>{{ order.id }}</strong></td><td><b>{{ order.customer }}</b><small>{{ order.phone }}</small><small>{{ order.email || t('noEmail') }}</small></td><td>{{ order.date }}<small>{{ order.time }}</small></td><td>{{ order.type }}</td><td><b>{{ order.itemNames || order.items }}</b></td><td><strong>{{ formatMoney(order.amount) }}</strong></td>
                <td><select class="status-select" :value="order.status" :disabled="!canEditOrders" @change="changeOrderStatus(order, $event.target.value)"><option v-for="status in orderStatuses" :key="status" :value="status">{{ t(status.toLowerCase()) }}</option></select></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template v-else-if="section === '/reservations'">
      <div class="management-toolbar">
        <label class="management-search"><span>⌕</span><input v-model="reservationSearch" type="search" :placeholder="t('searchCustomer')" /></label>
        <label class="date-filter"><span>{{ t('date') }}</span><input v-model="selectedDate" type="date" /></label>
      </div>
      <div class="reservation-summary">
        <div><span>{{ t('today') }}</span><strong>{{ todayReservations }}</strong></div><div><span>{{ t('upcoming') }}</span><strong>{{ upcomingReservations }}</strong></div><div><span>{{ t('guests') }}</span><strong>{{ upcomingGuests }}</strong></div><div><span>{{ t('pending') }}</span><strong>{{ reservations.filter(item => item.status === 'Pending').length }}</strong></div>
      </div>
      <div class="reservation-calendar">
        <article v-for="item in filteredReservations" :key="item.id" class="reservation-card">
          <div class="reservation-date"><strong>{{ new Date(item.date).toLocaleDateString(undefined, { day: '2-digit' }) }}</strong><span>{{ new Date(item.date).toLocaleDateString(undefined, { month: 'short' }) }}</span></div>
          <div class="reservation-details"><p>{{ item.time }} · {{ item.table }}</p><h3>{{ item.customer }}</h3><small>{{ item.guests }} {{ t('guests') }} · {{ item.phone }}</small><small>{{ item.email || t('noEmail') }}</small></div>
          <select class="status-select" :value="item.status" @change="changeReservationStatus(item, $event.target.value)"><option value="Pending">{{ t('pending') }}</option><option value="Confirmed">{{ t('confirmed') }}</option><option value="Seated">{{ t('seated') }}</option><option value="Completed">{{ t('completed') }}</option><option value="Cancelled">{{ t('cancelled') }}</option></select>
        </article>
      </div>
    </template>

    <template v-else-if="section === '/customers'">
      <div class="management-toolbar"><label class="management-search"><span>⌕</span><input v-model="customerSearch" type="search" :placeholder="t('searchCustomers')" /></label></div>
      <div class="customer-grid">
        <article v-for="customer in filteredCustomers" :key="customer.name" class="customer-card">
          <div class="customer-avatar">{{ customer.name.split(' ').map(part => part[0]).join('').slice(0, 2) }}</div>
          <div><h3>{{ customer.name }}</h3><span class="customer-status-badge">{{ t('business') }}</span><p>{{ customer.phone }}</p><p>{{ customer.email || t('noEmail') }}</p></div>
          <dl><div><dt>{{ t('orders') }}</dt><dd>{{ customer.orders }}</dd></div><div><dt>{{ t('spent') }}</dt><dd>{{ formatMoney(customer.spent) }}</dd></div><div><dt>{{ t('lastVisit') }}</dt><dd>{{ customer.lastOrder }}</dd></div></dl>
        </article>
      </div>
    </template>

    <template v-else-if="section === '/analytics'">
      <p v-if="analyticsError" class="hr-error" role="alert">{{ t(analyticsError) }}</p>
      <div class="analytics-grid">
        <article class="metric-card"><p>{{ t('grossRevenue') }}</p><strong>{{ formatMoney(analytics?.metrics.revenue || 0) }}</strong><span>{{ analytics?.metrics.deliveredOrders || 0 }} {{ t('deliveredOrders').toLowerCase() }}</span></article>
        <article class="metric-card"><p>{{ t('totalOrders') }}</p><strong>{{ analytics?.metrics.totalOrders || 0 }}</strong><span>{{ analytics?.metrics.deliveredOrders || 0 }} {{ t('deliveredOrders').toLowerCase() }}</span></article>
        <article class="metric-card"><p>{{ t('reservations') }}</p><strong>{{ analytics?.metrics.reservations || 0 }}</strong><span>{{ reservations.filter(item => item.status === 'Pending').length }} {{ t('pending').toLowerCase() }}</span></article>
        <article class="metric-card"><p>{{ t('repeatCustomers') }}</p><strong>{{ repeatCustomerRate }}</strong><span>{{ t('basedOnDeliveredOrders') }}</span></article>
      </div>
      <div v-if="analytics" class="panel analytics-panel">
        <div class="panel-heading"><div><p>{{ t('revenueOverview') }}</p><strong>{{ t('deliveredOrders') }}</strong></div><select v-model.number="selectedAnalyticsRange" :aria-label="t('revenueOverview')"><option :value="7">{{ t('last7') }}</option><option :value="30">{{ t('last30') }}</option></select></div>
        <div class="analytics-bars">
          <div v-for="day in analyticsChartData" :key="day.date" :title="`${day.date}: ${formatMoney(day.amount)}`">
            <span :style="{ height: `${Math.max(3, day.amount / analyticsChartMaximum * 100)}%` }"></span><small>{{ dayLabel(day.date) }}</small>
          </div>
        </div>
      </div>
      <div v-if="analytics && !analytics.metrics.totalOrders" class="hr-readonly-note">{{ t('noOrders') }}</div>
    </template>

    <template v-else-if="section === '/settings'">
      <form class="settings-form panel" @submit.prevent="saveSettings">
        <div class="panel-heading"><div><p>{{ t('restaurantProfile') }}</p><strong>{{ t('generalSettings') }}</strong></div></div>
        <div class="settings-fields">
          <label>{{ t('restaurantName') }}<input v-model="settings.name" /></label><label>{{ t('phone') }}<input v-model="settings.phone" /></label><label>{{ t('email') }}<input v-model="settings.email" type="email" /></label><label>{{ t('address') }}<input v-model="settings.address" /></label>
          <label>{{ t('openingTime') }}<input v-model="settings.opening" type="time" /></label><label>{{ t('closingTime') }}<input v-model="settings.closing" type="time" /></label>
        </div>
        <div class="settings-actions"><button class="primary-button" type="submit">{{ t('saveChanges') }}</button></div>
      </form>
    </template>
  </div>
</template>
