<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="site-footer">
    <div class="footer-main content-wrap">
      <div>
        <RouterLink class="brand footer-brand" to="/">
          <span class="brand-mark">S</span><span>SAVORY<span class="brand-dot">.</span></span>
        </RouterLink>
        <p>Thoughtfully prepared food, warm hospitality, and memorable evenings.</p>
      </div>
      <div>
        <h3>Explore</h3>
        <RouterLink to="/menu">Our menu</RouterLink>
        <RouterLink to="/reservation">Reservations</RouterLink>
        <RouterLink to="/track">Track order</RouterLink>
      </div>
      <div>
        <h3>Visit</h3>
        <p>24 Tashkent Street<br />Mon–Sun, 10:00–23:00</p>
        <a href="tel:+998901234567">+998 90 123 45 67</a>
      </div>
      <div>
        <h3>Newsletter</h3>
        <form class="newsletter" @submit.prevent>
          <input aria-label="Email address" type="email" placeholder="Email address" />
          <button aria-label="Subscribe" type="submit">→</button>
        </form>
      </div>
    </div>
    <div class="footer-bottom content-wrap">
      <span>© 2026 Savory Restaurant</span>
      <span>Privacy&nbsp;&nbsp;&nbsp; Terms</span>
    </div>
  </footer>
</template>
