<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { loadMenu, saveMenu } from '../data/menuData'
import { t } from '../i18n'

const menu = ref(loadMenu())
const activeCategory = ref('All')
const search = ref('')
const editing = ref(null)
const showModal = ref(false)
const syncError = ref('')
let menuRefreshTimer
const categories = ['Starters', 'Mains', 'Desserts', 'Drinks']
const emptyDish = () => ({ name: '', description: '', price: '', category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', available: true })

const filtered = computed(() => menu.value.filter((dish) => {
  const categoryMatch = activeCategory.value === 'All' || dish.category === activeCategory.value
  const searchMatch = !search.value || dish.name.toLowerCase().includes(search.value.toLowerCase())
  return categoryMatch && searchMatch
}))

function openAdd() {
  editing.value = emptyDish()
  showModal.value = true
}

function openEdit(dish) {
  editing.value = { ...dish }
  showModal.value = true
}

async function persistMenu() {
  const response = await fetch('/api/menu', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(menu.value),
  })
  if (!response.ok) throw new Error('Не удалось сохранить меню на сервере.')
  saveMenu(menu.value)
  syncError.value = ''
}

async function refreshMenu() {
  try {
    const response = await fetch('/api/menu')
    if (!response.ok) throw new Error('Не удалось загрузить общее меню.')
    const sharedMenu = await response.json()
    if (sharedMenu.length) {
      menu.value = sharedMenu
      saveMenu(sharedMenu)
    } else {
      await persistMenu()
    }
  } catch (error) {
    console.error('Unable to synchronize menu:', error)
    syncError.value = error.message
  }
}

onMounted(() => {
  refreshMenu()
  menuRefreshTimer = window.setInterval(refreshMenu, 5000)
})
onBeforeUnmount(() => window.clearInterval(menuRefreshTimer))

async function saveDish() {
  if (!editing.value.name.trim()) return
  const previous = [...menu.value]
  if (editing.value.id) {
    const index = menu.value.findIndex((dish) => dish.id === editing.value.id)
    menu.value[index] = { ...editing.value, price: Number(editing.value.price) }
  } else {
    menu.value.push({ ...editing.value, id: Date.now(), price: Number(editing.value.price) })
  }
  try {
    await persistMenu()
  } catch (error) {
    console.error('Unable to save dish:', error)
    menu.value = previous
    syncError.value = error.message
    return
  }
  showModal.value = false
}

async function deleteDish(id) {
  if (!confirm(`${t('delete')} this dish from the menu?`)) return
  const previous = [...menu.value]
  menu.value = menu.value.filter((dish) => dish.id !== id)
  try {
    await persistMenu()
  } catch (error) {
    console.error('Unable to delete dish:', error)
    menu.value = previous
    syncError.value = error.message
  }
}

async function toggleAvailability(dish) {
  dish.available = !dish.available
  try {
    await persistMenu()
  } catch (error) {
    console.error('Unable to update dish availability:', error)
    dish.available = !dish.available
    syncError.value = error.message
  }
}
</script>

<template>
  <div class="management-page">
    <p v-if="syncError" class="hr-error" role="alert">{{ syncError }}</p>
    <div class="management-toolbar">
      <label class="management-search"><span>⌕</span><input v-model="search" type="search" :placeholder="t('searchDishes')" /></label>
      <button class="primary-button" @click="openAdd">{{ t('addDish') }}</button>
    </div>

    <div class="category-filter">
      <button :class="{ active: activeCategory === 'All' }" @click="activeCategory = 'All'">{{ t('all') }} <span>{{ menu.length }}</span></button>
      <button v-for="category in categories" :key="category" :class="{ active: activeCategory === category }" @click="activeCategory = category">
        {{ t(category.toLowerCase()) }} <span>{{ menu.filter(d => d.category === category).length }}</span>
      </button>
    </div>

    <div class="dish-management-grid">
      <article v-for="dish in filtered" :key="dish.id" class="management-dish-card">
        <div class="management-dish-image">
          <img :src="dish.image" :alt="dish.name" />
          <button :class="{ unavailable: !dish.available }" @click="toggleAvailability(dish)">{{ dish.available ? t('available') : t('hidden') }}</button>
        </div>
        <div class="management-dish-copy">
          <p>{{ dish.category }}</p>
          <h3>{{ dish.name }}</h3>
          <small>{{ dish.description }}</small>
          <div class="dish-card-footer">
            <strong>${{ Number(dish.price).toFixed(2) }}</strong>
            <div>
              <button class="icon-action" :aria-label="t('editDish')" @click="openEdit(dish)">{{ t('edit') }}</button>
              <button class="icon-action danger" :aria-label="t('delete')" @click="deleteDish(dish.id)">{{ t('delete') }}</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <form class="management-modal" @submit.prevent="saveDish">
        <div class="modal-heading"><div><p>{{ editing.id ? t('editDish') : t('newDish') }}</p><h2>{{ editing.id ? editing.name : t('addMenuItem') }}</h2></div><button type="button" @click="showModal = false">×</button></div>
        <label>{{ t('name') }}<input v-model="editing.name" required :placeholder="t('dishName')" /></label>
        <label>{{ t('description') }}<textarea v-model="editing.description" required rows="3" :placeholder="t('ingredients')"></textarea></label>
        <div class="modal-row">
          <label>{{ t('price') }}<input v-model="editing.price" required min="0" step="0.01" type="number" /></label>
          <label>{{ t('category') }}<select v-model="editing.category"><option v-for="category in categories" :key="category" :value="category">{{ t(category.toLowerCase()) }}</option></select></label>
        </div>
        <label>{{ t('imageUrl') }}<input v-model="editing.image" type="url" placeholder="https://..." /></label>
        <div class="modal-actions"><button type="button" class="secondary-button" @click="showModal = false">{{ t('cancel') }}</button><button type="submit" class="primary-button">{{ t('saveDish') }}</button></div>
      </form>
    </div>
  </div>
</template>
