<script setup>
import { RouterLink } from 'vue-router'

const dishes = [
  { name: 'Truffle Tagliatelle', description: 'Fresh pasta, wild mushrooms, aged parmesan', price: '18', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85' },
  { name: 'Garden Burrata', description: 'Heirloom tomatoes, basil oil, sourdough', price: '16', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { name: 'Grilled Sea Bass', description: 'Charred lemon, herbs, seasonal vegetables', price: '24', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85' },
]
</script>

<template>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Seasonal kitchen · Est. 2014</p>
      <h1>Flavors that<br /><em>bring us together.</em></h1>
      <p class="hero-text">Modern comfort food, sourced with care and served with heart. Every plate is an invitation to stay a little longer.</p>
      <div class="hero-actions">
        <RouterLink class="button" to="/menu">Explore our menu</RouterLink>
        <RouterLink class="text-link" to="/reservation">Reserve a table <span>↗</span></RouterLink>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-image"></div>
      <div class="open-card"><span class="status-dot"></span><div><strong>Open today</strong><small>10:00 — 23:00</small></div></div>
      <div class="rating-card"><strong>4.9</strong><span>★★★★★</span><small>1,200+ reviews</small></div>
    </div>
  </section>

  <section class="featured content-wrap">
    <div class="section-heading">
      <div><p class="eyebrow">From our kitchen</p><h2>Chef’s favorites</h2></div>
      <RouterLink class="text-link" to="/menu">View full menu <span>→</span></RouterLink>
    </div>
    <div class="dish-grid">
      <article v-for="dish in dishes" :key="dish.name" class="dish-card">
        <div class="dish-image"><img :src="dish.image" :alt="dish.name" /><span class="price">${{ dish.price }}</span></div>
        <div class="dish-info"><h3>{{ dish.name }}</h3><p>{{ dish.description }}</p></div>
      </article>
    </div>
  </section>

  <section class="story">
    <div class="story-image"></div>
    <div class="story-copy">
      <p class="eyebrow">Our philosophy</p>
      <h2>Simple ingredients,<br /><em>extraordinary moments.</em></h2>
      <p>We work closely with local growers and trusted producers to create food that feels familiar, yet surprises you with every bite.</p>
      <RouterLink class="text-link" to="/menu">Discover our story <span>→</span></RouterLink>
    </div>
  </section>
</template>
