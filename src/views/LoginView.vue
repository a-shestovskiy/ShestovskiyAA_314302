<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ADMIN, INSPECTOR, logEvent, state } from '../stores/state'

const router = useRouter()
const login = ref('i.petrova')
const password = ref('demo1234')
const show = ref(false)
const error = ref('')

const ACCOUNTS = {
  'i.petrova': { fio: 'Петрова Ирина Сергеевна', role: INSPECTOR },
  admin: { fio: 'Козлов Максим Юрьевич', role: ADMIN }
}

function submit() {
  const acc = ACCOUNTS[login.value.trim()]
  if (!acc || password.value.length < 4) {
    error.value = 'Неверный логин или пароль'
    return
  }
  state.user = { login: login.value.trim(), ...acc }
  logEvent('Вход', 'Успешная авторизация')
  router.push(acc.role === ADMIN ? '/admin/users' : '/dashboard')
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-side d-none d-md-flex">
      <v-icon icon="mdi-shield-check-outline" size="56" color="white" />
      <h1 style="color: #fff; margin-top: 24px">РискСкоринг</h1>
      <p style="color: rgba(255, 255, 255, 0.85); max-width: 360px; margin-top: 12px; font-size: 16px; line-height: 26px">
        Платформа анализа рисков кредитования физических лиц. Заявка обрабатывается за 0,4 нормо-часа.
      </p>
    </div>
    <div class="login-form">
      <v-card class="card-pad" width="400" max-width="100%">
        <h2>Вход в систему</h2>
        <p class="t-caption mb-6">Введите корпоративные учётные данные</p>
        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">{{ error }}</v-alert>
        <div class="field-label">Логин</div>
        <v-text-field v-model="login" prepend-inner-icon="mdi-account-outline" class="mb-4" @keyup.enter="submit" />
        <div class="field-label">Пароль</div>
        <v-text-field
          v-model="password"
          :type="show ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          class="mb-6"
          @click:append-inner="show = !show"
          @keyup.enter="submit"
        />
        <v-btn block color="primary" size="large" @click="submit">Войти</v-btn>
        <p class="t-caption mt-4">Демо: <b>i.petrova</b> — инспектор, <b>admin</b> — администратор (пароль любой от 4 символов).</p>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.login-wrap { display: flex; min-height: 100vh; }
.login-side {
  flex: 1; flex-direction: column; justify-content: center; padding: 64px;
  background: linear-gradient(145deg, #143A75 0%, #1F4E9C 60%, #0E9F8E 130%);
}
.login-form { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
</style>
