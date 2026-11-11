<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import fallbackImage from '../assets/images/hero.jpg'
import { t } from '../i18n'

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks']
const active = ref('All')

const defaultMenu = [
  { name: 'Garden Burrata', description: 'Heirloom tomatoes, basil oil, sourdough', price: '$16', category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85' },
  { name: 'Beef Carpaccio', description: 'Parmesan, capers, rocket, truffle dressing', price: '$19', category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85' },
  { name: 'Wild Mushroom Soup', description: 'Cream, thyme, roasted chestnuts, brioche', price: '$13', category: 'Starters', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=85' },
  { name: 'Crispy Calamari', description: 'Chili aioli, lemon, pickled herbs', price: '$15', category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=85' },
  { name: 'Whipped Feta', description: 'Honey, pistachio, oregano, warm flatbread', price: '$12', category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85' },
  { name: 'Seasonal Tartlet', description: 'Roasted vegetables, goats cheese, herbs', price: '$14', category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85' },
  { name: 'Truffle Tagliatelle', description: 'Fresh pasta, wild mushrooms, aged parmesan', price: '$18', category: 'Mains', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85' },
  { name: 'Grilled Sea Bass', description: 'Charred lemon, herbs, seasonal vegetables', price: '$24', category: 'Mains', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=85' },
  { name: 'Herb-Roasted Chicken', description: 'Potato purée, glazed carrots, chicken jus', price: '$22', category: 'Mains', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=85' },
  { name: 'Slow-Cooked Lamb', description: 'Smoked aubergine, jus, pomegranate', price: '$27', category: 'Mains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85' },
  { name: 'Wild Salmon', description: 'Fennel, citrus beurre blanc, dill', price: '$26', category: 'Mains', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=85' },
  { name: 'Mushroom Risotto', description: 'Arborio rice, porcini, mascarpone, truffle', price: '$20', category: 'Mains', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=700&q=85' },
  { name: 'Braised Short Rib', description: 'Red wine sauce, potato mash, garden greens', price: '$29', category: 'Mains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85' },
  { name: 'Ricotta Ravioli', description: 'Spinach, brown butter, sage, hazelnut', price: '$21', category: 'Mains', image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=700&q=85' },
  { name: 'Charred Steak', description: 'Pepper sauce, hand-cut fries, watercress', price: '$32', category: 'Mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=85' },
  { name: 'Eggplant Milanese', description: 'Tomato fondue, basil, parmesan, olive oil', price: '$19', category: 'Mains', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=700&q=85' },
  { name: 'Burnt Honey Tart', description: 'Vanilla cream, sea salt, toasted hazelnut', price: '$12', category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85' },
  { name: 'Dark Chocolate Fondant', description: 'Chocolate sauce, crème fraîche, cocoa nibs', price: '$13', category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85' },
  { name: 'Classic Tiramisu', description: 'Espresso, mascarpone, cocoa, ladyfingers', price: '$11', category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=85' },
  { name: 'Lemon Meringue', description: 'Lemon curd, torched meringue, shortbread', price: '$12', category: 'Desserts', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=700&q=85' },
  { name: 'Seasonal Pavlova', description: 'Fresh berries, vanilla cream, mint', price: '$13', category: 'Desserts', image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=700&q=85' },
  { name: 'Affogato', description: 'Vanilla gelato, espresso, almond biscotti', price: '$8', category: 'Desserts', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=85' },
  { name: 'Fresh Citrus Spritz', description: 'Orange, lemon, rosemary, sparkling water', price: '$8', category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=85' },
  { name: 'Cucumber Cooler', description: 'Cucumber, lime, mint, soda', price: '$7', category: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Berry Lemonade', description: 'Seasonal berries, lemon, basil', price: '$8', category: 'Drinks', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=85' },
  { name: 'House Iced Tea', description: 'Black tea, peach, lemon, vanilla', price: '$7', category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=85' },
  { name: 'Ginger Mule', description: 'Ginger, lime, bitters, soda', price: '$8', category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=85' },
  { name: 'Tropical Smoothie', description: 'Mango, pineapple, coconut, lime', price: '$9', category: 'Drinks', image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8cdd?auto=format&fit=crop&w=700&q=85' },
  { name: 'Watermelon Refresher', description: 'Watermelon, mint, lime, sparkling water', price: '$8', category: 'Drinks', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=85' },
  { name: 'Cold Brew Coffee', description: 'Single-origin coffee, vanilla cream', price: '$7', category: 'Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85' },
]

function loadMenu() {
  try {
    const stored = JSON.parse(localStorage.getItem('savory-menu') || 'null')
    if (Array.isArray(stored) && stored.length) return stored
  } catch {}
  return defaultMenu
}

const menu = ref(loadMenu())
const filteredMenu = computed(() => menu.value.filter((item) => item.available !== false && (active.value === 'All' || item.category === active.value)))

let menuRefreshTimer
async function refreshMenu() {
  try {
    const response = await fetch('/api/menu')
    if (!response.ok) throw new Error('Unable to load current menu.')
    const sharedMenu = await response.json()
    if (sharedMenu.length) {
      menu.value = sharedMenu
      localStorage.setItem('savory-menu', JSON.stringify(sharedMenu))
    }
  } catch (error) {
    console.error('Unable to refresh menu from the restaurant:', error)
  }
}

onMounted(() => {
  refreshMenu()
  menuRefreshTimer = window.setInterval(refreshMenu, 5000)
})
onBeforeUnmount(() => window.clearInterval(menuRefreshTimer))

function onImageError(event) {
  event.target.onerror = null
  event.target.src = fallbackImage
}

function addToCart(item) {
  let cart = []
  try { cart = JSON.parse(localStorage.getItem('savory-cart') || '[]') } catch {}
  const existing = cart.find(product => product.name === item.name)
  if (existing) existing.quantity += 1
  else cart.push({
    name: item.name,
    description: item.description,
    price: Number(String(item.price).replace(/[^0-9.]/g, '')) || 0,
    image: item.image || fallbackImage,
    quantity: 1,
  })
  localStorage.setItem('savory-cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('savory-cart-updated'))
  window.alert(`${item.name} ${t('itemAdded')}`)
}
</script>

<template>
  <section class="page-hero"><p class="eyebrow">{{ t('seasonalKitchen') }}</p><h1>{{ t('ourMenu') }}</h1><p class="menu-intro">{{ t('menuIntro') }}</p></section>
  <section class="menu-section content-wrap">
    <div class="menu-toolbar">
      <div class="category-tabs">
        <button v-for="category in categories" :key="category" :class="{ active: active === category }" @click="active = category">{{ t(category.toLowerCase()) }}</button>
      </div>
      <p>{{ filteredMenu.length }} {{ t('dishes') }}</p>
    </div>
    <div class="menu-grid">
      <article v-for="item in filteredMenu" :key="item.name" class="menu-card">
        <img :src="item.image || fallbackImage" :alt="item.name" loading="lazy" @error="onImageError" />
        <div><p class="menu-category">{{ item.category }}</p><h3>{{ item.name }}</h3><p>{{ item.description }}</p><strong>{{ item.price }}</strong><button class="menu-add-button" type="button" @click="addToCart(item)">{{ t('addOrder') }}</button></div>
      </article>
    </div>
  </section>
</template>
