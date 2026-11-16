<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { t } from '../i18n'

const analytics = ref(null)
const orders = ref([])
const reservations = ref([])
const error = ref('')
const selectedRange = ref(7)
let refreshTimer

const stats = computed(() => {
  const metrics = analytics.value?.metrics || {}
  return [
    { label: 'totalRevenue', value: formatMoney(metrics.revenue), tone: 'green', icon: '$' },
    { label: 'deliveredOrders', value: metrics.deliveredOrders || 0, tone: 'orange', icon: '◇' },
    { label: 'reservations', value: metrics.reservations || 0, tone: 'blue', icon: '□' },
    { label: 'avgOrder', value: formatMoney(metrics.averageOrder), tone: 'red', icon: '↗' },
  ]
})

const chartData = computed(() => {
  const values = analytics.value?.dailyRevenue || []
  return values.slice(-selectedRange.value)
})
const chartMaximum = computed(() => Math.max(1, ...chartData.value.map(day => day.amount)))

function formatMoney(amount) {
  return `$${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function dayLabel(date) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'short' })
}

async function refreshDashboard() {
  try {
    const responses = await Promise.all([
      fetch('/api/analytics'),
      fetch('/api/orders'),
      fetch('/api/reservations'),
    ])
    if (responses.some(response => !response.ok)) throw new Error('Could not load live dashboard data.')
    const [nextAnalytics, nextOrders, nextReservations] = await Promise.all(responses.map(response => response.json()))
    analytics.value = nextAnalytics
    orders.value = nextOrders.slice(0, 5)
    reservations.value = nextReservations
      .filter(reservation => !['Cancelled', 'Completed'].includes(reservation.status))
      .sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`))
      .slice(0, 4)
    error.value = ''
  } catch (loadError) {
    console.error('Unable to load dashboard data:', loadError)
    error.value = 'dashboardLoadError'
  }
}

onMounted(() => {
  refreshDashboard()
  refreshTimer = window.setInterval(refreshDashboard, 3000)
  window.addEventListener('savory-data-updated', refreshDashboard)
})

onBeforeUnmount(() => {
  window.clearInterval(refreshTimer)
  window.removeEventListener('savory-data-updated', refreshDashboard)
})
</script>

<template>
  <div class="dashboard-page">
    <p v-if="error" class="dashboard-error" role="alert">{{ t(error) }}</p>
    <section class="stats-grid">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :class="stat.tone">{{ stat.icon }}</div>
        <div class="stat-content">
          <p>{{ t(stat.label) }}</p>
          <div><strong>{{ stat.value }}</strong></div>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel revenue-panel">
        <div class="panel-heading">
          <div><p>{{ t('revenue') }}</p><strong>{{ formatMoney(analytics?.metrics.revenue) }}</strong></div>
          <select v-model.number="selectedRange" :aria-label="t('revenue')"><option :value="7">{{ t('last7') }}</option><option :value="30">{{ t('last30') }}</option></select>
        </div>
        <div class="dashboard-revenue-bars" :aria-label="t('revenueOverview')">
          <div v-for="day in chartData" :key="day.date" :title="`${day.date}: ${formatMoney(day.amount)}`">
            <span :style="{ height: `${Math.max(3, day.amount / chartMaximum * 100)}%` }"></span>
            <small>{{ dayLabel(day.date) }}</small>
          </div>
        </div>
      </article>

      <article class="panel popular-panel">
        <div class="panel-heading"><div><p>{{ t('popularDishes') }}</p><strong>{{ t('topItems') }}</strong></div></div>
        <div class="popular-list">
          <div v-for="dish in analytics?.popularDishes || []" :key="dish.name" class="popular-dish-row">
            <div class="dish-rank">{{ dish.name.slice(0, 1).toUpperCase() }}</div>
            <div><strong>{{ dish.name }}</strong><small>{{ dish.count }} {{ t('itemsSold') }}</small></div>
          </div>
          <p v-if="!analytics?.popularDishes?.length" class="empty-dashboard">{{ t('noDeliveredSales') }}</p>
        </div>
      </article>
    </section>

    <section class="dashboard-grid lower-grid">
      <article class="panel orders-panel">
        <div class="panel-heading"><div><p>{{ t('recentOrders') }}</p><strong>{{ t('liveActivity') }}</strong></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>{{ t('order') }}</th><th>{{ t('customer') }}</th><th>{{ t('items') }}</th><th>{{ t('total') }}</th><th>{{ t('status') }}</th></tr></thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td><strong>{{ order.id }}</strong><small>{{ order.date }} {{ order.time }}</small></td>
                <td>{{ order.customer }}</td><td>{{ order.items }}</td><td>{{ formatMoney(order.amount) }}</td>
                <td><span class="status" :class="String(order.status).toLowerCase()">{{ t(String(order.status).toLowerCase()) }}</span></td>
              </tr>
              <tr v-if="!orders.length"><td colspan="5" class="empty-dashboard">{{ t('noOrders') }}</td></tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel reservation-panel">
        <div class="panel-heading"><div><p>{{ t('reservations') }}</p><strong>{{ t('upcoming') }}</strong></div></div>
        <div class="reservation-list">
          <div v-for="reservation in reservations" :key="reservation.id">
            <strong>{{ reservation.time }}</strong>
            <div><b>{{ reservation.customer }}</b><small>{{ reservation.date }} · {{ reservation.guests }} {{ t('guests') }}</small></div>
            <span class="status" :class="String(reservation.status).toLowerCase()">{{ t(String(reservation.status).toLowerCase()) }}</span>
          </div>
          <p v-if="!reservations.length" class="empty-dashboard">{{ t('noReservations') }}</p>
        </div>
      </article>
    </section>
  </div>
</template>
