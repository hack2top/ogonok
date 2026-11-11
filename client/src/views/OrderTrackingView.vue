<script setup>
import { t } from '../i18n'
</script>

<template>
  <section class="simple-page content-wrap">
    <p class="eyebrow">{{ t('status') }}</p><h1>{{ t('trackOrder') }}</h1>
    <form class="track-form" @submit.prevent><input :aria-label="t('orderNumber')" :placeholder="t('enterOrderNumber')" /><button class="button" type="submit">{{ t('trackButton') }}</button></form>
    <div class="tracking-status"><div><span>1</span><p>{{ t('confirmed') }}</p></div><div><span>2</span><p>{{ t('preparing') }}</p></div><div class="muted"><span>3</span><p>{{ t('onTheWay') }}</p></div></div>
  </section>
</template>
