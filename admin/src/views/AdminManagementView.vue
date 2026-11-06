<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { seedOrders, seedReservations } from '../data/adminData'

const route = useRoute()
const section = computed(() => route.path)
const orderSearch = ref('')
const orderStatus = ref('All')
const reservationSearch = ref('')
const customerSearch = ref('')
const reservationStatus = ref('All')
const selectedDate = ref('')
const orderStatuses = ['New', 'Preparing', 'Ready', 'Delivered', 'Cancelled']

const orders = ref(JSON.parse(localStorage.getItem('savory-orders') || 'null') || seedOrders.map(order => ({ ...order })))
const reservations = ref(JSON.parse(localStorage.getItem('savory-reservations') || 'null') || seedReservations.map(item => ({ ...item })))

watch(orders, value => localStorage.setItem('savory-orders', JSON.stringify(value)), { deep: true })
watch(reservations, value => localStorage.setItem('savory-reservations', JSON.stringify(value)), { deep: true })

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
    const existing = map.get(order.customer) || { name: order.customer, phone: order.phone, orders: 0, spent: 0, lastOrder: order.date }
    existing.orders += 1
    existing.spent += order.amount
    if (order.date > existing.lastOrder) existing.lastOrder = order.date
    map.set(order.customer, existing)
  })
  reservations.value.forEach(item => {
    if (!map.has(item.customer)) map.set(item.customer, { name: item.customer, phone: item.phone, orders: 0, spent: 0, lastOrder: item.date })
  })
  return [...map.values()]
})
const filteredCustomers = computed(() => customers.value.filter(customer =>
  !customerSearch.value ||
  `${customer.name} ${customer.phone}`.toLowerCase().includes(customerSearch.value.toLowerCase())
))

function changeOrderStatus(order, status) {
  order.status = status
}

function changeReservationStatus(item, status) {
  item.status = status
}

function formatMoney(amount) {
  return `$${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const settings = ref(JSON.parse(localStorage.getItem('savory-settings') || '{"name":"Savory","phone":"+998 90 123 45 67","email":"hello@savory.uz","address":"24 Tashkent Street","opening":"10:00","closing":"23:00"}'))
function saveSettings() {
  localStorage.setItem('savory-settings', JSON.stringify(settings.value))
  window.alert('Restaurant settings saved.')
}
</script>

<template>
  <div class="management-page">
    <template v-if="section === '/orders'">
      <div class="management-toolbar">
        <label class="management-search"><span>⌕</span><input v-model="orderSearch" type="search" placeholder="Search orders or customers..." /></label>
        <div class="filter-buttons"><button v-for="status in ['All', ...orderStatuses]" :key="status" :class="{ active: orderStatus === status }" @click="orderStatus = status">{{ status }}</button></div>
      </div>
      <div class="panel data-panel">
        <div class="panel-heading"><div><p>All activity</p><strong>{{ filteredOrders.length }} orders</strong></div></div>
        <div class="table-wrap">
          <table class="management-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date & time</th><th>Type</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td><strong>{{ order.id }}</strong></td><td><b>{{ order.customer }}</b><small>{{ order.phone }}</small></td><td>{{ order.date }}<small>{{ order.time }}</small></td><td>{{ order.type }}</td><td>{{ order.items }}</td><td><strong>{{ formatMoney(order.amount) }}</strong></td>
                <td><select class="status-select" :value="order.status" @change="changeOrderStatus(order, $event.target.value)"><option v-for="status in orderStatuses" :key="status">{{ status }}</option></select></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template v-else-if="section === '/reservations'">
      <div class="management-toolbar">
        <label class="management-search"><span>⌕</span><input v-model="reservationSearch" type="search" placeholder="Search customer..." /></label>
        <label class="date-filter"><span>Date</span><input v-model="selectedDate" type="date" /></label>
      </div>
      <div class="reservation-summary">
        <div><span>Today</span><strong>4</strong></div><div><span>Upcoming</span><strong>{{ reservations.length }}</strong></div><div><span>Guests</span><strong>{{ reservations.reduce((sum, item) => sum + item.guests, 0) }}</strong></div><div><span>Pending</span><strong>{{ reservations.filter(item => item.status === 'Pending').length }}</strong></div>
      </div>
      <div class="reservation-calendar">
        <article v-for="item in filteredReservations" :key="item.id" class="reservation-card">
          <div class="reservation-date"><strong>{{ new Date(item.date).toLocaleDateString(undefined, { day: '2-digit' }) }}</strong><span>{{ new Date(item.date).toLocaleDateString(undefined, { month: 'short' }) }}</span></div>
          <div class="reservation-details"><p>{{ item.time }} · {{ item.table }}</p><h3>{{ item.customer }}</h3><small>{{ item.guests }} guests · {{ item.phone }}</small></div>
          <select class="status-select" :value="item.status" @change="changeReservationStatus(item, $event.target.value)"><option>Pending</option><option>Confirmed</option><option>Seated</option><option>Completed</option><option>Cancelled</option></select>
        </article>
      </div>
    </template>

    <template v-else-if="section === '/customers'">
      <div class="management-toolbar"><label class="management-search"><span>⌕</span><input v-model="customerSearch" type="search" placeholder="Search customers..." /></label></div>
      <div class="customer-grid">
        <article v-for="customer in filteredCustomers" :key="customer.name" class="customer-card">
          <div class="customer-avatar">{{ customer.name.split(' ').map(part => part[0]).join('').slice(0, 2) }}</div>
          <div><h3>{{ customer.name }}</h3><p>{{ customer.phone }}</p></div>
          <dl><div><dt>Orders</dt><dd>{{ customer.orders }}</dd></div><div><dt>Spent</dt><dd>{{ formatMoney(customer.spent) }}</dd></div><div><dt>Last visit</dt><dd>{{ customer.lastOrder }}</dd></div></dl>
        </article>
      </div>
    </template>

    <template v-else-if="section === '/analytics'">
      <div class="analytics-grid">
        <article class="metric-card"><p>Gross revenue</p><strong>$24,890</strong><span>+12.5% this week</span></article>
        <article class="metric-card"><p>Total orders</p><strong>348</strong><span>+8.2% this week</span></article>
        <article class="metric-card"><p>Reservations</p><strong>86</strong><span>+5.4% this week</span></article>
        <article class="metric-card"><p>Repeat customers</p><strong>42%</strong><span>+3.1% this week</span></article>
      </div>
      <div class="panel analytics-panel"><div class="panel-heading"><div><p>Revenue overview</p><strong>November 2026</strong></div></div><div class="analytics-bars"><div v-for="(value, index) in [42,58,51,72,64,88,76]" :key="index"><span :style="{ height: value + '%' }"></span><small>{{ ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index] }}</small></div></div></div>
    </template>

    <template v-else-if="section === '/settings'">
      <form class="settings-form panel" @submit.prevent="saveSettings">
        <div class="panel-heading"><div><p>Restaurant profile</p><strong>General settings</strong></div></div>
        <div class="settings-fields">
          <label>Restaurant name<input v-model="settings.name" /></label><label>Phone<input v-model="settings.phone" /></label><label>Email<input v-model="settings.email" type="email" /></label><label>Address<input v-model="settings.address" /></label>
          <label>Opening time<input v-model="settings.opening" type="time" /></label><label>Closing time<input v-model="settings.closing" type="time" /></label>
        </div>
        <div class="settings-actions"><button class="primary-button" type="submit">Save changes</button></div>
      </form>
    </template>
  </div>
</template>
