<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">Delivery status</p><h1>Track your order</h1>
    <form class="track-form" @submit.prevent><input aria-label="Order number" placeholder="Enter order number" /><button class="button" type="submit">Track</button></form>
    <div class="tracking-status"><div><span>1</span><p>Confirmed</p></div><div><span>2</span><p>Preparing</p></div><div class="muted"><span>3</span><p>On the way</p></div></div>
  </section>
</template>
