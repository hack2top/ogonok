<script setup>
import { RouterLink } from 'vue-router'
import { t } from '../../i18n'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main content-wrap">
      <div>
        <RouterLink class="brand footer-brand" to="/">
          <span class="brand-mark">S</span><span>SAVORY<span class="brand-dot">.</span></span>
        </RouterLink>
        <p>{{ t('footerCopy') }}</p>
      </div>
      <div>
        <h3>{{ t('explore') }}</h3>
        <RouterLink to="/menu">{{ t('ourMenu') }}</RouterLink>
        <RouterLink to="/reservation">{{ t('reservations') }}</RouterLink>
        <RouterLink to="/track">{{ t('track') }}</RouterLink>
      </div>
      <div>
        <h3>{{ t('visit') }}</h3>
        <p>24 Tashkent Street<br />Mon–Sun, 10:00–23:00</p>
        <a href="tel:+998901234567">+998 90 123 45 67</a>
      </div>
      <div>
        <h3>{{ t('newsletter') }}</h3>
        <form class="newsletter" @submit.prevent>
          <input :aria-label="t('email')" type="email" :placeholder="t('email')" />
          <button :aria-label="t('subscribe')" type="submit">→</button>
        </form>
      </div>
    </div>
    <div class="footer-bottom content-wrap">
      <span>© 2026 Savory Restaurant</span>
      <span>{{ t('privacy') }}&nbsp;&nbsp;&nbsp; {{ t('terms') }}</span>
    </div>
  </footer>
</template>
