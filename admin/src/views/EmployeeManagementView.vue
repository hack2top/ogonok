<script setup>
import { onMounted, ref } from 'vue'
import { t } from '../i18n'

const employees = ref([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const currentRole = sessionStorage.getItem('savory-admin-role')
const canManageEmployees = ['creator', 'admin', 'analyst'].includes(currentRole)
const canAddEmployees = ['creator', 'admin'].includes(currentRole)
const roles = [
  { value: 'chef', label: 'chef' },
  { value: 'courier', label: 'courier' },
  { value: 'admin', label: 'admin' },
  { value: 'analyst', label: 'analyst' },
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
    const changes = { ...edits.value[employee.username] }
    if (!changes.password) delete changes.password
    const response = await fetch(`/api/employees/${encodeURIComponent(employee.username)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
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
  if (!window.confirm(`${t('confirmDelete')} «${employee.displayName}» (${employee.username})?`)) return
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
      <div><p>{{ t('hr') }}</p><h2>{{ t('employeesAccess') }}</h2></div>
      <span>{{ employees.length }} {{ t('employeeCount') }}</span>
    </div>

    <p v-if="error" class="hr-error" role="alert">{{ error }}</p>
    <p v-if="!canManageEmployees" class="hr-readonly-note">{{ t('readOnlyEmployees') }}</p>
    <p v-else-if="!canAddEmployees" class="hr-readonly-note">{{ t('analystPermission') }}</p>

    <form v-if="canAddEmployees" class="hr-add-form panel" @submit.prevent="addEmployee">
      <div class="panel-heading"><div><p>{{ t('newEmployee') }}</p><strong>{{ t('createAccount') }}</strong></div></div>
      <div class="hr-form-grid">
        <label>{{ t('name') }}<input v-model="newEmployee.displayName" required maxlength="80" :placeholder="t('fullName')" /></label>
        <label>{{ t('login') }}<input v-model="newEmployee.username" required minlength="3" maxlength="30" pattern="[A-Za-z0-9._\-]+" autocomplete="off" /></label>
        <label>{{ t('password') }}<input v-model="newEmployee.password" required minlength="8" type="password" autocomplete="new-password" /></label>
        <label>{{ t('role') }}<select v-model="newEmployee.role"><option v-for="role in roles" :key="role.value" :value="role.value">{{ t(role.label) }}</option></select></label>
        <button class="primary-button" type="submit" :disabled="saving">{{ t('addEmployee') }}</button>
      </div>
    </form>

    <div v-if="loading" class="hr-readonly-note">{{ t('loadingEmployees') }}</div>
    <div v-else class="hr-employee-list">
      <article v-for="employee in employees" :key="employee.username" class="hr-employee-card panel">
        <div class="hr-employee-identity">
          <div class="customer-avatar">{{ employee.displayName.split(' ').map(part => part[0]).join('').slice(0, 2) }}</div>
          <div><strong>{{ employee.displayName }}</strong><small>@{{ employee.username }}</small></div>
        </div>
        <template v-if="canManageEmployees">
          <label>{{ t('name') }}<input v-model="edits[employee.username].displayName" required maxlength="80" /></label>
          <label>{{ t('role') }}<select v-model="edits[employee.username].role"><option v-for="role in roles" :key="role.value" :value="role.value">{{ t(role.label) }}</option></select></label>
          <label>{{ t('newPassword') }}<input v-model="edits[employee.username].password" minlength="8" type="password" autocomplete="new-password" :placeholder="t('leaveBlank')" /></label>
          <div class="hr-employee-actions">
            <button class="primary-button" type="button" :disabled="saving" @click="updateEmployee(employee)">{{ t('save') }}</button>
            <button class="secondary-button danger-button" type="button" :disabled="saving" @click="removeEmployee(employee)">{{ t('remove') }}</button>
          </div>
        </template>
        <span v-else class="hr-role-badge">{{ t(employee.role) }}</span>
      </article>
      <p v-if="!employees.length && !error" class="hr-readonly-note">{{ t('noEmployees') }}</p>
    </div>
  </section>
</template>
