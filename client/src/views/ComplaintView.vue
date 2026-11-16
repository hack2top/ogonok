<script setup>
import { ref } from 'vue'
import { t } from '../i18n'

let profile = {}
try { profile = JSON.parse(sessionStorage.getItem('savory-user-profile') || '{}') } catch {}

const name = ref(profile.name || '')
const email = ref(profile.email || '')
const orderId = ref('')
const message = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref('')

async function submitComplaint() {
  sending.value = true
  sent.value = false
  error.value = ''
  try {
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        orderId: orderId.value.trim(),
        message: message.value.trim(),
      }),
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error || 'complaintSendError')
    }
    sent.value = true
    message.value = ''
    orderId.value = ''
  } catch (submitError) {
    console.error('Unable to send complaint:', submitError)
    error.value = submitError.message.includes('not configured') ? 'complaintNotConfigured' : 'complaintSendError'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">{{ t('feedback') }}</p>
    <h1>{{ t('writeComplaint') }}</h1>
    <p class="complaint-intro">{{ t('complaintIntro') }}</p>
    <form class="booking-form complaint-form" @submit.prevent="submitComplaint">
      <label>{{ t('name') }}<input v-model="name" required maxlength="100" autocomplete="name" /></label>
      <label>{{ t('emailLabel') }}<input v-model="email" required maxlength="254" type="email" autocomplete="email" /></label>
      <label>{{ t('orderNumberOptional') }}<input v-model="orderId" maxlength="100" /></label>
      <label>{{ t('complaintMessage') }}<textarea v-model="message" required minlength="10" maxlength="5000" rows="7"></textarea></label>
      <button class="button" type="submit" :disabled="sending">{{ sending ? t('sending') : t('sendComplaint') }}</button>
      <p v-if="sent" class="checkout-success" role="status">{{ t('complaintSent') }}</p>
      <p v-if="error" class="customer-status-error" role="alert">{{ t(error) }}</p>
    </form>
  </section>
</template>
