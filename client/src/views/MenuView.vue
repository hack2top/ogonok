<script setup>
import { ref } from 'vue'
const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks']
const active = ref('All')
const menu = [
  ['Garden Burrata', 'Heirloom tomato, basil oil, sourdough', '$16', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', 'Starters'],
  ['Truffle Tagliatelle', 'Wild mushrooms, parmesan, herbs', '$18', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85', 'Mains'],
  ['Grilled Sea Bass', 'Charred lemon, seasonal vegetables', '$24', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=85', 'Mains'],
  ['Burnt Honey Tart', 'Vanilla cream, sea salt, hazelnut', '$12', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85', 'Desserts'],
]
const filtered = () => active.value === 'All' ? menu : menu.filter(item => item[4] === active.value)
</script>

<template>
  <section class="page-hero">
    <p class="eyebrow">Savory kitchen</p>
    <h1>Our menu</h1>
  </section>
  <section class="menu-section content-wrap">
    <div class="category-tabs">
      <button v-for="category in categories" :key="category" :class="{ active: active === category }" @click="active = category">{{ category }}</button>
    </div>
    <div class="menu-grid">
      <article v-for="item in filtered()" :key="item[0]" class="menu-card">
        <img :src="item[3]" :alt="item[0]" />
        <div><p class="menu-category">{{ item[4] }}</p><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p><strong>{{ item[2] }}</strong></div>
      </article>
    </div>
  </section>
</template>
