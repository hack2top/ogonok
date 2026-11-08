<script setup>
import { RouterLink } from 'vue-router'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import heroImage from '../assets/images/hero.jpg'
import storyImage from '../assets/images/story.jpg'

useScrollAnimation()

const dishes = [
  { name: 'Truffle Tagliatelle', description: 'Fresh pasta, wild mushrooms, aged parmesan', price: '18', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85' },
  { name: 'Garden Burrata', description: 'Heirloom tomatoes, basil oil, sourdough', price: '16', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { name: 'Grilled Sea Bass', description: 'Charred lemon, herbs, seasonal vegetables', price: '24', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85' },
]

const experiences = [
  { number: '01', title: 'Seasonal ingredients', text: 'Our menu follows the harvest, with produce sourced from growers and producers we know personally.' },
  { number: '02', title: 'Honest cooking', text: 'We let exceptional ingredients speak for themselves through careful, contemporary techniques.' },
  { number: '03', title: 'Warm hospitality', text: 'Thoughtful service creates a relaxed room where every guest feels genuinely welcome.' },
]

const gallery = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=85',
]
</script>

<template>
  <section class="hero">
    <div class="hero-copy" data-aos="fade-up" data-aos-delay="100">
      <p class="eyebrow">Seasonal kitchen · Est. 2014</p>
      <h1>Flavors that<br /><em>bring us together.</em></h1>
      <p class="hero-text">Modern comfort food, sourced with care and served with heart. Every plate is an invitation to stay a little longer.</p>
      <div class="hero-actions">
        <RouterLink class="button" to="/menu">Explore our menu</RouterLink>
        <RouterLink class="text-link" to="/reservation">Reserve a table <span>↗</span></RouterLink>
      </div>
    </div>
    <div class="hero-visual" data-aos="zoom-in" data-aos-delay="250">
      <div class="hero-image" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="open-card"><span class="status-dot"></span><div><strong>Open today</strong><small>10:00 — 23:00</small></div></div>
      <div class="rating-card"><strong>4.9</strong><span>★★★★★</span><small>1,200+ reviews</small></div>
    </div>
  </section>

  <section class="featured content-wrap">
    <div class="section-heading" data-reveal>
      <div><p class="eyebrow">From our kitchen</p><h2>Chef’s favorites</h2></div>
      <RouterLink class="text-link" to="/menu">View full menu <span>→</span></RouterLink>
    </div>
    <div class="dish-grid">
      <article v-for="(dish, index) in dishes" :key="dish.name" class="dish-card" data-aos="zoom-in" :data-aos-delay="String(index * 120)">
        <div class="dish-image"><img :src="dish.image" :alt="dish.name" loading="lazy" /><span class="price">${{ dish.price }}</span></div>
        <div class="dish-info"><h3>{{ dish.name }}</h3><p>{{ dish.description }}</p></div>
      </article>
    </div>
  </section>

  <section class="story">
    <div class="story-image" data-aos="reveal-left" :style="{ backgroundImage: `url(${storyImage})` }"></div>
    <div class="story-copy" data-aos="fade-left">
      <p class="eyebrow">Our philosophy</p>
      <h2>Simple ingredients,<br /><em>extraordinary moments.</em></h2>
      <p>For more than a decade, Savory has brought people together over thoughtful food, generous plates, and genuine hospitality. We cook with the rhythm of the seasons and work closely with local growers, fishermen, and artisan makers.</p>
      <RouterLink class="text-link" to="/menu">Discover our menu <span>→</span></RouterLink>
    </div>
  </section>

  <section class="experience content-wrap">
    <div class="section-heading" data-reveal>
      <div><p class="eyebrow">The Savory experience</p><h2>Made for good company</h2></div>
      <p class="section-note">Lunch, long dinners, celebrations, or a quiet glass at the bar—every table is treated with the same care.</p>
    </div>
    <div class="experience-grid">
      <article v-for="(item, index) in experiences" :key="item.number" data-aos="fade-up" :data-aos-delay="String(index * 100)">
        <span>{{ item.number }}</span>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
      </article>
    </div>
  </section>

  <section class="stats-strip">
    <div data-aos="zoom-in"><strong>12+</strong><span>Years of hospitality</span></div>
    <div data-aos="zoom-in"><strong>30</strong><span>Seasonal dishes</span></div>
    <div data-aos="zoom-in"><strong>18</strong><span>Local partners</span></div>
    <div data-aos="zoom-in"><strong>4.9</strong><span>Guest rating</span></div>
  </section>

  <section class="gallery-section content-wrap">
    <div class="section-heading" data-reveal>
      <div><p class="eyebrow">Around our table</p><h2>A glimpse of Savory</h2></div>
    </div>
    <div class="gallery-grid">
      <figure v-for="(image, index) in gallery" :key="image" :class="`gallery-${index + 1}`" data-aos="zoom-in" :data-aos-delay="String(index * 100)">
        <img :src="image" alt="Savory restaurant atmosphere" loading="lazy" />
      </figure>
    </div>
  </section>

  <section class="testimonial" data-aos="fade-up">
    <p class="eyebrow">Guest story</p>
    <blockquote>“A room full of warmth, dishes with real personality, and service that makes you want to return.”</blockquote>
    <p>— Maya R. · Local Guide</p>
  </section>

  <section class="reservation-cta">
    <div data-aos="fade-left"><p class="eyebrow">Your table is waiting</p><h2>Come dine with us</h2><p>Open daily for lunch and dinner. Walk-ins are welcome, while reservations are recommended for evenings and weekends.</p></div>
    <RouterLink class="button" to="/reservation" data-aos="zoom-in">Reserve a table</RouterLink>
  </section>
</template>
