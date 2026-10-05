<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { lookupRegistry } from '../stores/mock'
import { annuity, calcScore } from '../stores/scoring'
import { logEvent, state } from '../stores/state'

const router = useRouter()

const unp = ref('')
const loading = ref(false)
const attempt = ref(0)
const error = ref('')
const profile = ref(null)

const loan = ref({ sum: 20000, months: 36, rate: 14.5, collateral: 'Недвижимость' })
const collaterals = ['Недвижимость', 'Транспорт', 'Поручитель', 'Без обеспечения']

const unpError = computed(() => (unp.value && !/^\d{9}$/.test(unp.value) ? 'УНП состоит из 9 цифр' : ''))
const payment = computed(() => annuity(loan.value.sum, loan.value.rate, loan.value.months))
const fmt = (n) => n.toLocaleString('ru-RU', { maximumFractionDigits: 2 })

async function request() {
  error.value = ''
  profile.value = null
  loading.value = true
  // три попытки переподключения (альтернативный поток 4а UC-1)
  for (attempt.value = 1; attempt.value <= 3; attempt.value++) {
    try {
      profile.value = await lookupRegistry(unp.value)
      logEvent('Запрос реестра', `УНП ${unp.value}: данные получены`)
      break
    } catch {
      if (attempt.value === 3) {
        error.value = 'Внешняя база недоступна: превышено время ожидания. Повторите запрос позже.'
        logEvent('Интеграция', `УНП ${unp.value}: реестр недоступен после 3 попыток`, 'error')
      }
    }
  }
  loading.value = false
}

function calculate() {
  const result = calcScore(profile.value, loan.value, state.weights)
  state.draft = { profile: profile.value, loan: { ...loan.value }, result }
  logEvent('Расчёт', `УНП ${profile.value.unp}: рейтинг ${result.score}, статус «${result.status}»`)
  router.push('/result')
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Новая кредитная заявка</h1>
        <div class="t-caption">Шаг 1. Данные заёмщика · Шаг 2. Параметры кредита · Шаг 3. Расчёт рейтинга</div>
      </div>
    </div>

    <v-row>
      <v-col cols="12" lg="7">
        <v-card class="card-pad mb-4">
          <h3 class="mb-4">1. Данные заёмщика</h3>
          <div class="field-label">УНП или идентификационный номер заявителя</div>
          <div class="d-flex ga-3 align-start">
            <v-text-field
              v-model="unp"
              placeholder="9 цифр, например 190456789"
              :error-messages="unpError"
              prepend-inner-icon="mdi-card-account-details-outline"
              @keyup.enter="unp.length === 9 && request()"
            />
            <v-btn color="primary" size="large" :loading="loading" :disabled="unp.length !== 9 || !!unpError" @click="request">
              Запросить данные
            </v-btn>
          </div>
          <div class="t-caption mt-1">Демо-УНП: 190456789, 191234567, 192345678 (банкрот), 000000000 (сбой реестра)</div>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mt-4" rounded />
          <div v-if="loading" class="t-caption mt-1">Запрос в МВД и Кредитный регистр, попытка {{ attempt }} из 3…</div>

          <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
            {{ error }}
            <template #append><v-btn size="small" variant="outlined" @click="request">Повторить</v-btn></template>
          </v-alert>

          <v-card v-if="profile" variant="tonal" color="success" class="mt-4 pa-4" border="0">
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-check-circle" class="mr-2" />
              <b>Данные получены из реестров</b>
            </div>
            <v-row dense>
              <v-col cols="6" class="t-body">ФИО: <b>{{ profile.fio }}</b></v-col>
              <v-col cols="6" class="t-body">Паспорт: <b>{{ profile.passport }}</b></v-col>
              <v-col cols="6" class="t-body">Возраст: <b>{{ profile.age }}</b></v-col>
              <v-col cols="6" class="t-body">Доход: <b>{{ fmt(profile.income) }} BYN/мес.</b></v-col>
              <v-col cols="6" class="t-body">Стаж: <b>{{ profile.experience }} лет</b></v-col>
              <v-col cols="6" class="t-body">Просрочек в истории: <b>{{ profile.delays }}</b></v-col>
            </v-row>
          </v-card>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="card-pad" :disabled="!profile">
          <h3 class="mb-4">2. Параметры кредита</h3>
          <div class="field-label">Сумма, BYN: {{ fmt(loan.sum) }}</div>
          <v-slider v-model="loan.sum" :min="1000" :max="50000" :step="500" color="primary" hide-details class="mb-4" />
          <v-row dense>
            <v-col cols="6">
              <div class="field-label">Срок, мес.</div>
              <v-text-field v-model.number="loan.months" type="number" min="6" max="84" />
            </v-col>
            <v-col cols="6">
              <div class="field-label">Ставка, %</div>
              <v-text-field v-model.number="loan.rate" type="number" step="0.5" />
            </v-col>
          </v-row>
          <div class="field-label mt-3">Обеспечение</div>
          <v-select v-model="loan.collateral" :items="collaterals" />
          <v-divider class="my-4" />
          <div class="d-flex justify-space-between align-center">
            <span class="t-caption">Ежемесячный платёж (аннуитет)</span>
            <span class="t-h3" style="color: var(--c-primary-dark)">{{ fmt(payment) }} BYN</span>
          </div>
          <v-btn block color="primary" size="large" class="mt-5" prepend-icon="mdi-calculator-variant-outline" @click="calculate">
            Рассчитать рейтинг
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
