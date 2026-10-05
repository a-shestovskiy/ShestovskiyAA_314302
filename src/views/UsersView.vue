<script setup>
import { ref } from 'vue'
import { ADMIN, INSPECTOR, logEvent, state } from '../stores/state'

const dialog = ref(false)
const form = ref({ login: '', fio: '', role: INSPECTOR })
const loginError = ref('')
const tempPassword = ref('')
const roles = [INSPECTOR, ADMIN]

function open() {
  form.value = { login: '', fio: '', role: INSPECTOR }
  loginError.value = ''
  tempPassword.value = ''
  dialog.value = true
}

function save() {
  if (state.users.some((u) => u.login === form.value.login)) {
    loginError.value = 'Такой логин уже существует. Введите уникальный идентификатор.'
    return
  }
  state.users.push({ ...form.value, active: true, last: '—' })
  tempPassword.value = Math.random().toString(36).slice(2, 10) + 'A1'
  logEvent('Учётные записи', `Создан профиль ${form.value.login} (${form.value.role})`)
}

function toggle(u) {
  u.active = !u.active
  logEvent('Учётные записи', `Профиль ${u.login} ${u.active ? 'разблокирован' : 'заблокирован'}`, 'warn')
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Управление пользователями</h1>
        <div class="t-caption">Профили сотрудников и ролевой доступ</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-account-plus-outline" @click="open">Создать профиль</v-btn>
    </div>

    <v-card>
      <v-table>
        <thead>
          <tr><th>Логин</th><th>ФИО</th><th>Роль</th><th>Последний вход</th><th>Статус</th><th class="text-right">Действия</th></tr>
        </thead>
        <tbody>
          <tr v-for="u in state.users" :key="u.login">
            <td>{{ u.login }}</td>
            <td>{{ u.fio }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.last }}</td>
            <td><v-chip :color="u.active ? 'success' : 'error'" variant="tonal" label>{{ u.active ? 'Активен' : 'Заблокирован' }}</v-chip></td>
            <td class="text-right">
              <v-btn
                size="small"
                variant="outlined"
                :color="u.active ? 'error' : 'primary'"
                :prepend-icon="u.active ? 'mdi-lock-outline' : 'mdi-lock-open-outline'"
                @click="toggle(u)"
              >{{ u.active ? 'Блокировать' : 'Разблокировать' }}</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="480">
      <v-card class="card-pad">
        <h2 class="mb-4">Новый профиль сотрудника</h2>
        <template v-if="!tempPassword">
          <div class="field-label">Логин</div>
          <v-text-field v-model="form.login" :error-messages="loginError" class="mb-3" @update:model-value="loginError = ''" />
          <div class="field-label">ФИО</div>
          <v-text-field v-model="form.fio" class="mb-3" />
          <div class="field-label">Роль</div>
          <v-select v-model="form.role" :items="roles" />
          <div class="d-flex justify-end ga-3 mt-6">
            <v-btn variant="text" @click="dialog = false">Отмена</v-btn>
            <v-btn color="primary" :disabled="!form.login || !form.fio" @click="save">Сохранить</v-btn>
          </div>
        </template>
        <template v-else>
          <v-alert type="success" variant="tonal" class="mb-4">Профиль создан. Передайте сотруднику временный пароль.</v-alert>
          <div class="field-label">Временный пароль</div>
          <v-text-field :model-value="tempPassword" readonly prepend-inner-icon="mdi-key-outline" />
          <div class="d-flex justify-end mt-6"><v-btn color="primary" @click="dialog = false">Готово</v-btn></div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
