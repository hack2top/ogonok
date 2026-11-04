<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">Your order</p><h1>Shopping cart</h1>
    <div class="empty-state"><span>◯</span><h2>Your cart is empty</h2><p>Explore our seasonal menu and find something delicious.</p><RouterLink class="button" to="/menu">Browse menu</RouterLink></div>
  </section>
</template>
