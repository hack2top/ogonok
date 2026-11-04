<template>
  <section class="page-hero"><p class="eyebrow">Join us</p><h1>Reserve a table</h1></section>
  <section class="form-page content-wrap">
    <div class="reservation-image"></div>
    <form class="booking-form" @submit.prevent>
      <h2>Your details</h2>
      <label>Name<input required type="text" placeholder="Your name" /></label>
      <label>Email<input required type="email" placeholder="you@example.com" /></label>
      <div class="form-row">
        <label>Date<input required type="date" /></label>
        <label>Time<select><option>18:00</option><option>19:30</option><option>21:00</option></select></label>
      </div>
      <label>Guests<select><option>2 guests</option><option>3 guests</option><option>4 guests</option><option>5+ guests</option></select></label>
      <button class="button" type="submit">Request reservation</button>
    </form>
  </section>
</template>
