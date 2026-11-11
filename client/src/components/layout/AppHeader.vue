<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import MobileMenu from './MobileMenu.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { t, theme, setTheme } from '../../i18n'

const menuOpen = ref(false)
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Savory home">
      <span class="brand-mark">S</span>
      <span>SAVORY<span class="brand-dot">.</span></span>
    </RouterLink>

    <nav class="desktop-nav" :aria-label="t('home')">
      <RouterLink to="/">{{ t('home') }}</RouterLink>
      <RouterLink to="/menu">{{ t('menu') }}</RouterLink>
      <RouterLink to="/reservation">{{ t('reservations') }}</RouterLink>
      <RouterLink to="/track">{{ t('track') }}</RouterLink>
    </nav>

    <div class="header-actions">
      <RouterLink class="icon-button" to="/cart" :aria-label="t('cart')">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6m4 12a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/></svg>
        <span>{{ t('cart') }}</span>
      </RouterLink>
      <RouterLink class="button button-small" to="/reservation">{{ t('bookTable') }}</RouterLink>
      <LanguageSwitcher />
      <button class="theme-toggle" type="button" :aria-label="theme === 'dark' ? t('lightMode') : t('darkMode')" :title="theme === 'dark' ? t('lightMode') : t('darkMode')" @click="setTheme(theme === 'dark' ? 'light' : 'dark')">{{ theme === 'dark' ? '☀' : '☾' }}</button>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
        <span></span><span></span>
      </button>
    </div>
    <MobileMenu :open="menuOpen" @close="menuOpen = false" />
  </header>
</template>
