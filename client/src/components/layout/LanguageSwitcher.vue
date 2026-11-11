<script setup>
import { languages, locale, setLocale, t } from '../../i18n'
</script>

<template>
  <label class="language-switcher">
    <span class="sr-only">{{ t('language') }}</span>
    <select :value="locale" :aria-label="t('language')" @change="setLocale($event.target.value)">
      <option v-for="language in languages" :key="language.value" :value="language.value">{{ language.label }}</option>
    </select>
  </label>
</template>