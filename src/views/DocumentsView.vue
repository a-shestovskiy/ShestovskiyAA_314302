<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { annuity } from '../stores/scoring'
import { logEvent, state } from '../stores/state'

const route = useRoute()
const router = useRouter()
const app = computed(() => state.applications.find((a) => a.id === route.params.id) ?? state.applications.find((a) => a.status === 'Одобрено'))
const RATE = 14.5

const schedule = computed(() => {
  if (!app.value) return []
  const r = RATE / 100 / 12
  const pay = annuity(app.value.sum, RATE, app.value.months)
  let rest = app.value.sum
  return Array.from({ length: Math.min(app.value.months, 12) }, (_, i) => {
    const interest = rest * r
    const principal = pay - interest
    rest -= principal
    return { n: i + 1, pay, principal, interest, rest: Math.max(rest, 0) }
  })
})
const fmt = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function confirm() {
  app.value.status = 'Ожидает подписания'
  logEvent('Документы', `Заявка ${app.value.id}: пакет документов сформирован`)
  router.push('/archive/' + app.value.id)
}
</script>

<template>
  <div v-if="app" class="page">
    <div class="page-head">
      <div>
        <h1>Пакет кредитной документации</h1>
        <div class="t-caption">Заявка {{ app.id }} · {{ app.fio }}</div>
      </div>
      <div class="d-flex ga-3">
        <v-btn variant="outlined" prepend-icon="mdi-printer-outline">Печать</v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-download">Скачать PDF</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check" @click="confirm">Передать на подписание</v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" lg="7">
        <v-card class="card-pad doc-sheet">
          <div class="text-center mb-6">
            <div class="t-caption">Кредитный договор № {{ app.id.replace('ЗК', 'КД') }}</div>
            <h2 class="mt-1">КРЕДИТНЫЙ ДОГОВОР</h2>
          </div>
          <p>Банк предоставляет заёмщику <b>{{ app.fio }}</b> (УНП {{ app.unp }}) кредит в сумме <b>{{ fmt(app.sum) }} BYN</b> на срок <b>{{ app.months }} мес.</b> под <b>{{ RATE }}%</b> годовых.</p>
          <p class="mt-3">Погашение осуществляется равными аннуитетными платежами согласно графику (приложение 1). Скоринговый рейтинг заёмщика на дату оформления: <b>{{ app.score }}</b>.</p>
          <div class="d-flex justify-space-between mt-10">
            <div class="sign">Банк: ____________</div>
            <div class="sign">Заёмщик: ____________</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="5">
        <v-card>
          <div class="pa-4 pb-2"><h3>График платежей (первые 12 мес.)</h3></div>
          <v-table density="compact">
            <thead>
              <tr><th>№</th><th class="text-right">Платёж</th><th class="text-right">Основной долг</th><th class="text-right">Проценты</th><th class="text-right">Остаток</th></tr>
            </thead>
            <tbody>
              <tr v-for="s in schedule" :key="s.n">
                <td>{{ s.n }}</td>
                <td class="text-right">{{ fmt(s.pay) }}</td>
                <td class="text-right">{{ fmt(s.principal) }}</td>
                <td class="text-right">{{ fmt(s.interest) }}</td>
                <td class="text-right">{{ fmt(s.rest) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else class="page"><v-alert type="info" variant="tonal">Нет одобренных заявок для формирования документов.</v-alert></div>
</template>

<style scoped>
.doc-sheet { min-height: 420px; line-height: 24px; }
.sign { color: var(--c-muted); }
</style>
