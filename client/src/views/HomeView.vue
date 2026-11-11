<script setup>
import { RouterLink } from 'vue-router'
import { useScrollAnimation } from '../composables/useScrollAnimation'
import { t } from '../i18n'
import heroImage from '../assets/images/hero.jpg'
import storyImage from '../assets/images/story.jpg'

useScrollAnimation()

const dishes = [
  { name: 'Truffle Tagliatelle', description: 'Fresh pasta, wild mushrooms, aged parmesan', price: '18', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85' },
  { name: 'Garden Burrata', description: 'Heirloom tomatoes, basil oil, sourdough', price: '16', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { name: 'Grilled Sea Bass', description: 'Charred lemon, herbs, seasonal vegetables', price: '24', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85' },
]

const experiences = [
  { number: '01', title: 'seasonalIngredients', text: 'seasonalCopy' },
  { number: '02', title: 'honestCooking', text: 'honestCopy' },
  { number: '03', title: 'warmHospitality', text: 'hospitalityCopy' },
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
      <p class="eyebrow">{{ t('seasonalKitchen') }}</p>
      <h1>{{ t('heroTitle') }}<br /><em>{{ t('heroTitleAccent') }}</em></h1>
      <p class="hero-text">{{ t('heroCopy') }}</p>
      <div class="hero-actions">
        <RouterLink class="button" to="/menu">{{ t('exploreMenu') }}</RouterLink>
        <RouterLink class="text-link" to="/reservation">{{ t('reserveTable') }} <span>↗</span></RouterLink>
      </div>
    </div>
    <div class="hero-visual" data-aos="zoom-in" data-aos-delay="250">
      <div class="hero-image" :style="{ backgroundImage: `url(${heroImage})` }"></div>
      <div class="open-card"><span class="status-dot"></span><div><strong>{{ t('openToday') }}</strong><small>10:00 — 23:00</small></div></div>
      <div class="rating-card"><strong>4.9</strong><span>★★★★★</span><small>{{ t('reviews') }}</small></div>
    </div>
  </section>

  <section class="featured content-wrap">
    <div class="section-heading" data-reveal>
      <div><p class="eyebrow">{{ t('fromKitchen') }}</p><h2>{{ t('chefFavorites') }}</h2></div>
      <RouterLink class="text-link" to="/menu">{{ t('fullMenu') }} <span>→</span></RouterLink>
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
      <p class="eyebrow">{{ t('philosophy') }}</p>
      <h2>{{ t('simpleIngredients') }}<br /><em>{{ t('extraordinaryMoments') }}</em></h2>
      <p>{{ t('ourStory') }}</p>
      <RouterLink class="text-link" to="/menu">{{ t('discoverMenu') }} <span>→</span></RouterLink>
    </div>
  </section>

  <section class="experience content-wrap">
    <div class="section-heading" data-reveal>
      <div><p class="eyebrow">{{ t('experience') }}</p><h2>{{ t('goodCompany') }}</h2></div>
      <p class="section-note">{{ t('experienceCopy') }}</p>
    </div>
    <div class="experience-grid">
      <article v-for="(item, index) in experiences" :key="item.number" data-aos="fade-up" :data-aos-delay="String(index * 100)">
        <span>{{ item.number }}</span>
        <h3>{{ t(item.title) }}</h3>
        <p>{{ t(item.text) }}</p>
      </article>
    </div>
  </section>

  <section class="stats-strip">
    <div data-aos="zoom-in"><strong>12+</strong><span>{{ t('yearsHospitality') }}</span></div>
    <div data-aos="zoom-in"><strong>30</strong><span>{{ t('seasonalDishes') }}</span></div>
    <div data-aos="zoom-in"><strong>18</strong><span>{{ t('localPartners') }}</span></div>
    <div data-aos="zoom-in"><strong>4.9</strong><span>{{ t('guestRating') }}</span></div>
  </section>

  <section class="gallery-section content-wrap">
    <div class="section-heading" data-reveal>
      <div><p class="eyebrow">{{ t('aroundTable') }}</p><h2>{{ t('glimpse') }}</h2></div>
    </div>
    <div class="gallery-grid">
      <figure v-for="(image, index) in gallery" :key="image" :class="`gallery-${index + 1}`" data-aos="zoom-in" :data-aos-delay="String(index * 100)">
        <img :src="image" alt="Savory restaurant atmosphere" loading="lazy" />
      </figure>
    </div>
  </section>

  <section class="testimonial" data-aos="fade-up">
    <p class="eyebrow">{{ t('guestStory') }}</p>
    <blockquote>{{ t('testimonial') }}</blockquote>
    <p>— Maya R. · Local Guide</p>
  </section>

  <section class="reservation-cta">
    <div data-aos="fade-left"><p class="eyebrow">{{ t('tableWaiting') }}</p><h2>{{ t('dineWithUs') }}</h2><p>{{ t('hoursCopy') }}</p></div>
    <RouterLink class="button" to="/reservation" data-aos="zoom-in">{{ t('reserveTable') }}</RouterLink>
  </section>
</template>
