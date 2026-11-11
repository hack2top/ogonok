<script setup>
import { ref } from 'vue'
import { t } from '../i18n'

const stats = [
  { label: 'totalRevenue', value: '$24,890', change: '+12.5%', tone: 'green', icon: '$' },
  { label: 'orders', value: '348', change: '+8.2%', tone: 'orange', icon: '◇' },
  { label: 'reservations', value: '86', change: '+5.4%', tone: 'blue', icon: '□' },
  { label: 'avgOrder', value: '$71.52', change: '-1.8%', tone: 'red', icon: '↗' },
]

const orders = ref([
  { id: '#SV-1048', customer: 'Emily Wilson', items: 4, amount: '$128.50', time: '12 min ago', status: 'Preparing' },
  { id: '#SV-1047', customer: 'James Miller', items: 2, amount: '$64.00', time: '18 min ago', status: 'Ready' },
  { id: '#SV-1046', customer: 'Sophia Brown', items: 5, amount: '$156.20', time: '24 min ago', status: 'Delivered' },
  { id: '#SV-1045', customer: 'Daniel Clark', items: 3, amount: '$92.40', time: '31 min ago', status: 'Preparing' },
])

const reservations = [
  { time: '18:30', name: 'Olivia Taylor', guests: 4, table: 'T08' },
  { time: '19:00', name: 'Noah Harris', guests: 2, table: 'T03' },
  { time: '19:30', name: 'Emma Martin', guests: 6, table: 'T12' },
  { time: '20:00', name: 'Liam Walker', guests: 3, table: 'T06' },
]
</script>

<template>
  <div class="dashboard-page">
    <section class="stats-grid">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon" :class="stat.tone">{{ stat.icon }}</div>
        <div class="stat-content">
          <p>{{ t(stat.label) }}</p>
          <div><strong>{{ stat.value }}</strong><span>{{ stat.change }}</span></div>
        </div>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel revenue-panel">
        <div class="panel-heading">
          <div><p>{{ t('revenue') }}</p><strong>$24,890</strong></div>
          <select :aria-label="t('revenue')"><option>{{ t('last7') }}</option><option>{{ t('last30') }}</option></select>
        </div>
        <div class="chart" aria-label="Weekly revenue chart">
          <div class="chart-lines"><i></i><i></i><i></i><i></i></div>
          <svg viewBox="0 0 700 210" preserveAspectRatio="none" role="img">
            <defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#c86c4a" stop-opacity=".18"/><stop offset="100%" stop-color="#c86c4a" stop-opacity="0"/></linearGradient></defs>
            <path class="area" d="M0 172 C55 150 85 160 125 128 C170 92 205 125 250 105 C290 86 330 112 370 82 C420 45 455 72 500 55 C550 37 590 62 630 38 C660 25 680 32 700 18 L700 210 L0 210 Z"/>
            <path class="line" d="M0 172 C55 150 85 160 125 128 C170 92 205 125 250 105 C290 86 330 112 370 82 C420 45 455 72 500 55 C550 37 590 62 630 38 C660 25 680 32 700 18"/>
          </svg>
          <div class="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </div>
      </article>

      <article class="panel popular-panel">
        <div class="panel-heading"><div><p>{{ t('popularDishes') }}</p><strong>{{ t('topItems') }}</strong></div><button>{{ t('viewAll') }}</button></div>
        <div class="popular-list">
          <div><img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=160&q=80" alt="" /><div><strong>Truffle pasta</strong><small>126 orders</small></div><b>$18</b></div>
          <div><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=160&q=80" alt="" /><div><strong>Garden burrata</strong><small>98 orders</small></div><b>$16</b></div>
          <div><img src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=160&q=80" alt="" /><div><strong>Grilled sea bass</strong><small>84 orders</small></div><b>$24</b></div>
        </div>
      </article>
    </section>

    <section class="dashboard-grid lower-grid">
      <article class="panel orders-panel">
        <div class="panel-heading"><div><p>{{ t('recentOrders') }}</p><strong>{{ t('liveActivity') }}</strong></div><button>{{ t('viewAll') }}</button></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>{{ t('order') }}</th><th>{{ t('customer') }}</th><th>{{ t('items') }}</th><th>{{ t('total') }}</th><th>{{ t('status') }}</th></tr></thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td><strong>{{ order.id }}</strong><small>{{ order.time }}</small></td><td>{{ order.customer }}</td><td>{{ order.items }}</td><td>{{ order.amount }}</td><td><span class="status" :class="order.status.toLowerCase()">{{ t(order.status.toLowerCase()) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel reservation-panel">
        <div class="panel-heading"><div><p>{{ t('reservations') }}</p><strong>{{ t('tonight') }}</strong></div><button>{{ t('manage') }}</button></div>
        <div class="reservation-list">
          <div v-for="reservation in reservations" :key="reservation.time">
            <strong>{{ reservation.time }}</strong><div><b>{{ reservation.name }}</b><small>{{ reservation.guests }} {{ t('guests') }} · {{ reservation.table }}</small></div><button aria-label="Reservation options">•••</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>
