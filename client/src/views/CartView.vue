<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import fallbackImage from '../assets/images/hero.jpg'
import { t } from '../i18n'

const cart = ref([])
function loadCart() {
  try { cart.value = JSON.parse(localStorage.getItem('savory-cart') || '[]') } catch { cart.value = [] }
}
function saveCart() {
  localStorage.setItem('savory-cart', JSON.stringify(cart.value))
  window.dispatchEvent(new Event('savory-cart-updated'))
}
function changeQuantity(item, amount) {
  item.quantity = Math.max(1, item.quantity + amount)
  saveCart()
}
function removeItem(index) {
  cart.value.splice(index, 1)
  saveCart()
}
function imageError(event) {
  event.target.onerror = null
  event.target.src = fallbackImage
}
const total = computed(() => cart.value.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0))
onMounted(() => { loadCart(); window.addEventListener('savory-cart-updated', loadCart) })
onBeforeUnmount(() => window.removeEventListener('savory-cart-updated', loadCart))
</script>
<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">{{ t('yourOrder') }}</p><h1>{{ t('shoppingCart') }}</h1>
    <div v-if="!cart.length" class="empty-state"><span>◯</span><h2>{{ t('emptyCart') }}</h2><p>{{ t('emptyCartCopy') }}</p><RouterLink class="button" to="/menu">{{ t('browseMenu') }}</RouterLink></div>
    <div v-else class="cart-layout">
      <div class="cart-items">
        <article v-for="(item, index) in cart" :key="item.name" class="cart-item">
          <img :src="item.image || fallbackImage" :alt="item.name" @error="imageError" />
          <div><h3>{{ item.name }}</h3><p>${{ Number(item.price).toFixed(2) }}</p></div>
          <div class="cart-quantity"><button type="button" @click="changeQuantity(item, -1)">−</button><strong>{{ item.quantity }}</strong><button type="button" @click="changeQuantity(item, 1)">+</button></div>
          <button class="cart-remove" type="button" :aria-label="t('removeItem')" @click="removeItem(index)">×</button>
        </article>
      </div>
      <aside class="cart-summary"><p>{{ t('orderSummary') }}</p><strong>${{ total.toFixed(2) }}</strong><RouterLink class="button" to="/checkout">{{ t('continueCheckout') }}</RouterLink></aside>
    </div>
  </section>
</template>
