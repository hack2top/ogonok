<script setup>
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const requestContactDetails = inject('requestContactDetails')
const address = ref('')
const payment = ref('Cash on delivery')
const success = ref(false)
const syncError = ref('')

let profile = {}

function placeOrder() {
  requestContactDetails(() => placeOrderWithContact())
}

async function placeOrderWithContact() {
  try { profile = JSON.parse(sessionStorage.getItem('savory-user-profile') || '{}') } catch { profile = {} }
  let cart = []
  try { cart = JSON.parse(localStorage.getItem('savory-cart') || '[]') } catch {}
  if (!cart.length) return
  const amount = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const now = new Date()
  const order = {
    id: `#SV-${Date.now().toString().slice(-6)}`,
    customer: profile.email || 'Customer',
    phone: profile.phone || '',
    email: profile.email || '',
    date: now.toISOString().slice(0, 10),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    items: cart.reduce((sum, item) => sum + item.quantity, 0),
    itemNames: cart.map(item => item.name).join(', '),
    amount,
    status: 'New',
    type: 'Delivery',
    address: address.value,
  }

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    if (!response.ok) throw new Error('Order could not be synchronized.')
  } catch (error) {
    console.error('Unable to synchronize order:', error)
    syncError.value = 'Не удалось передать заказ ресторану. Проверьте подключение и повторите попытку.'
    return
  }

  let orders = []
  try { orders = JSON.parse(localStorage.getItem('savory-orders') || '[]') } catch {}
  orders.unshift(order)
  localStorage.setItem('savory-orders', JSON.stringify(orders))
  localStorage.removeItem('savory-cart')
  window.dispatchEvent(new Event('savory-cart-updated'))
  syncError.value = ''
  success.value = true
  window.setTimeout(() => router.push('/track'), 900)
}
</script>
<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">Final step</p><h1>Checkout</h1>
    <form class="checkout-form booking-form" @submit.prevent="placeOrder">
      <label>Delivery address<input v-model="address" required placeholder="Street, building, apartment" /></label>
      <label>Payment method<select v-model="payment"><option>Cash on delivery</option><option>Card</option></select></label>
      <button class="button" type="submit">Place order</button>
      <p v-if="success" class="checkout-success">Order placed successfully. Opening order tracking...</p>
      <p v-if="syncError" class="customer-status-error">{{ syncError }}</p>
    </form>
  </section>
</template>
