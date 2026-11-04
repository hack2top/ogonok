<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">Final step</p><h1>Checkout</h1>
    <form class="checkout-form booking-form" @submit.prevent>
      <label>Delivery address<input required placeholder="Street, building, apartment" /></label>
      <label>Phone number<input required type="tel" placeholder="+998" /></label>
      <label>Payment method<select><option>Cash on delivery</option><option>Card</option></select></label>
      <button class="button" type="submit">Place order</button>
    </form>
  </section>
</template>
