<script setup>
import { ref } from 'vue'
import storyImage from '../assets/images/story.jpg'
import { t } from '../i18n'

let profile = {}
try { profile = JSON.parse(sessionStorage.getItem('savory-user-profile') || '{}') } catch {}

const name = ref(profile.name || '')
const email = ref(profile.email || '')
const phone = ref(profile.phone || '')
const date = ref('')
const time = ref('18:00')
const guests = ref('2 guests')
const success = ref(false)
const syncError = ref('')

async function submitReservation() {
  let reservations = []
  try { reservations = JSON.parse(localStorage.getItem('savory-reservations') || '[]') } catch {}
  const reservation = {
    id: Date.now(),
    customer: name.value,
    phone: phone.value,
    email: email.value,
    date: date.value,
    time: time.value,
    guests: Number(String(guests.value).replace(/[^0-9]/g, '')) || 2,
    table: `T${String(reservations.length + 1).padStart(2, '0')}`,
    status: 'Pending',
  }
  try {
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    })
    if (!response.ok) throw new Error('Reservation could not be synchronized.')
  } catch (error) {
    console.error('Unable to synchronize reservation:', error)
    syncError.value = 'Не удалось отправить бронирование. Проверьте подключение и повторите попытку.'
    return
  }

  reservations.unshift(reservation)
  localStorage.setItem('savory-reservations', JSON.stringify(reservations))
  sessionStorage.setItem('savory-user-profile', JSON.stringify({
    name: name.value,
    email: email.value.trim().toLowerCase(),
    phone: phone.value.trim(),
  }))
  syncError.value = ''
  success.value = true
}
</script>
<template>
  <section class="page-hero"><p class="eyebrow">{{ t('joinUs') }}</p><h1>{{ t('reserveTable') }}</h1></section>
  <section class="form-page content-wrap">
    <div class="reservation-image" :style="{ backgroundImage: `url(${storyImage})` }"></div>
    <form class="booking-form" @submit.prevent="submitReservation">
      <h2>{{ t('details') }}</h2>
      <label>{{ t('name') }}<input v-model="name" required type="text" :placeholder="t('yourName')" /></label>
      <label>{{ t('emailLabel') }}<input v-model="email" required type="email" placeholder="you@example.com" /></label>
      <label>{{ t('phoneNumber') }}<input v-model="phone" required type="tel" placeholder="+998" /></label>
      <div class="form-row">
        <label>{{ t('date') }}<input v-model="date" required type="date" /></label>
        <label>{{ t('time') }}<select v-model="time"><option>18:00</option><option>19:30</option><option>21:00</option></select></label>
      </div>
      <label>{{ t('guests') }}<select v-model="guests"><option>2 {{ t('guests') }}</option><option>3 {{ t('guests') }}</option><option>4 {{ t('guests') }}</option><option>5+ {{ t('guests') }}</option></select></label>
      <button class="button" type="submit">{{ t('requestReservation') }}</button>
      <p v-if="success" class="checkout-success">{{ t('reservationSuccess') }}</p>
      <p v-if="syncError" class="customer-status-error">{{ syncError }}</p>
    </form>
  </section>
</template>
