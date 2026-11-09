<script setup>
import { onMounted, ref } from 'vue'

const employees = ref([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const currentRole = sessionStorage.getItem('savory-admin-role')
const canManageEmployees = ['creator', 'admin'].includes(currentRole)
const roles = [
  { value: 'chef', label: 'Главный шеф' },
  { value: 'courier', label: 'Курьер' },
  { value: 'admin', label: 'Админ' },
  { value: 'analyst', label: 'Аналитик' },
]
const newEmployee = ref({ username: '', displayName: '', password: '', role: 'chef' })
const edits = ref({})

function setError(message) {
  error.value = message
}

async function loadEmployees() {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/api/employees')
    if (!response.ok) throw new Error('Не удалось загрузить список сотрудников.')
    employees.value = await response.json()
    edits.value = Object.fromEntries(employees.value.map(employee => [
      employee.username,
      { displayName: employee.displayName, role: employee.role, password: '' },
    ]))
  } catch (loadError) {
    console.error('Unable to load employees:', loadError)
    setError(loadError.message)
  } finally {
    loading.value = false
  }
}

async function addEmployee() {
  saving.value = true
  error.value = ''
  try {
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee.value),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Не удалось добавить сотрудника.')
    newEmployee.value = { username: '', displayName: '', password: '', role: 'chef' }
    await loadEmployees()
  } catch (saveError) {
    console.error('Unable to create employee:', saveError)
    setError(saveError.message)
  } finally {
    saving.value = false
  }
}

async function updateEmployee(employee) {
  saving.value = true
  error.value = ''
  try {
    const response = await fetch(`/api/employees/${encodeURIComponent(employee.username)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edits.value[employee.username]),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Не удалось сохранить изменения.')
    await loadEmployees()
  } catch (saveError) {
    console.error('Unable to update employee:', saveError)
    setError(saveError.message)
  } finally {
    saving.value = false
  }
}

async function removeEmployee(employee) {
  if (!window.confirm(`Удалить сотрудника «${employee.displayName}» (${employee.username})?`)) return
  error.value = ''
  try {
    const response = await fetch(`/api/employees/${encodeURIComponent(employee.username)}`, { method: 'DELETE' })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Не удалось удалить сотрудника.')
    await loadEmployees()
  } catch (removeError) {
    console.error('Unable to delete employee:', removeError)
    setError(removeError.message)
  }
}

onMounted(loadEmployees)
</script>

<template>
  <section class="management-page">
    <div class="hr-page-heading">
      <div><p>HR</p><h2>Сотрудники и доступы</h2></div>
      <span>{{ employees.length }} сотрудников</span>
    </div>

    <p v-if="error" class="hr-error" role="alert">{{ error }}</p>
    <p v-if="!canManageEmployees" class="hr-readonly-note">У вас доступ только для просмотра списка сотрудников.</p>

    <form v-if="canManageEmployees" class="hr-add-form panel" @submit.prevent="addEmployee">
      <div class="panel-heading"><div><p>Новый сотрудник</p><strong>Создать учетную запись</strong></div></div>
      <div class="hr-form-grid">
        <label>Имя<input v-model="newEmployee.displayName" required maxlength="80" placeholder="Имя и фамилия" /></label>
        <label>Логин<input v-model="newEmployee.username" required minlength="3" maxlength="30" pattern="[A-Za-z0-9._-]+" autocomplete="off" placeholder="Уникальный логин" /></label>
        <label>Пароль<input v-model="newEmployee.password" required minlength="8" type="password" autocomplete="new-password" placeholder="Не менее 8 символов" /></label>
        <label>Роль<select v-model="newEmployee.role"><option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option></select></label>
        <button class="primary-button" type="submit" :disabled="saving">Добавить сотрудника</button>
      </div>
    </form>

    <div v-if="loading" class="hr-readonly-note">Загружаем сотрудников…</div>
    <div v-else class="hr-employee-list">
      <article v-for="employee in employees" :key="employee.username" class="hr-employee-card panel">
        <div class="hr-employee-identity">
          <div class="customer-avatar">{{ employee.displayName.split(' ').map(part => part[0]).join('').slice(0, 2) }}</div>
          <div><strong>{{ employee.displayName }}</strong><small>@{{ employee.username }}</small></div>
        </div>
        <template v-if="canManageEmployees">
          <label>Имя<input v-model="edits[employee.username].displayName" required maxlength="80" /></label>
          <label>Роль<select v-model="edits[employee.username].role"><option v-for="role in roles" :key="role.value" :value="role.value">{{ role.label }}</option></select></label>
          <label>Новый пароль<input v-model="edits[employee.username].password" minlength="8" type="password" autocomplete="new-password" placeholder="Оставьте пустым без изменений" /></label>
          <div class="hr-employee-actions">
            <button class="primary-button" type="button" :disabled="saving" @click="updateEmployee(employee)">Сохранить</button>
            <button class="secondary-button danger-button" type="button" :disabled="saving" @click="removeEmployee(employee)">Удалить</button>
          </div>
        </template>
        <span v-else class="hr-role-badge">{{ employee.roleName }}</span>
      </article>
      <p v-if="!employees.length && !error" class="hr-readonly-note">Сотрудников пока нет.</p>
    </div>
  </section>
</template>
