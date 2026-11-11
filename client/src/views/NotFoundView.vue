<script setup>
import { RouterLink } from 'vue-router'
import { t } from '../i18n'
</script>
<template>
  <section class="not-found"><p>404</p><h1>{{ t('notFound') }}</h1><RouterLink class="button" to="/">{{ t('returnHome') }}</RouterLink></section>
</template>
