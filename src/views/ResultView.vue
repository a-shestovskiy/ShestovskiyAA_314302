<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusChip from '../components/StatusChip.vue'
import { THRESHOLD } from '../stores/scoring'
import { logEvent, state } from '../stores/state'

const router = useRouter()
const d = computed(() => state.draft)
if (!state.draft) router.replace('/new')

const r = computed(() => d.value?.result)
const ringColor = computed(() => (r.value?.status === 'Одобрено' ? '#2E7D32' : '#C62828'))
const C = 2 * Math.PI * 70
const dash = computed(() => `${(C * (r.value?.score ?? 0)) / 100} ${C}`)
const positives = computed(() => r.value?.factors.filter((f) => f.positive) ?? [])
const negatives = computed(() => r.value?.factors.filter((f) => !f.positive) ?? [])

function save(toDocs) {
  const nextNo = 413 + state.applications.length - 7
  const id = `ЗК-2026-${String(nextNo).padStart(4, '0')}`
  state.applications.unshift({
    id,
    date: new Date().toLocaleDateString('ru-RU'),
    fio: d.value.profile.fio,
    unp: d.value.profile.unp,
    sum: d.value.loan.sum,
    months: d.value.loan.months,
    score: r.value.score,
    status: r.value.status
  })
  logEvent('Заявка', `Заявка ${id} сохранена в архив`)
  state.draft = null
  router.push(toDocs ? '/documents/' + id : '/archive/' + id)
}
</script>

<template>
  <div v-if="d" class="page">
    <div class="page-head">
      <div>
        <h1>Результат скоринга</h1>
        <div class="t-caption">{{ d.profile.fio }} · УНП {{ d.profile.unp }}</div>
      </div>
      <div class="d-flex ga-3">
        <v-btn variant="outlined" @click="router.push('/new')">Изменить параметры</v-btn>
        <v-btn v-if="r.status === 'Одобрено'" color="primary" prepend-icon="mdi-file-document-outline" @click="save(true)">
          Сохранить и сформировать документы
        </v-btn>
        <v-btn v-else color="primary" prepend-icon="mdi-content-save-outline" @click="save(false)">Сохранить в архив</v-btn>
      </div>
    </div>

    <v-alert v-if="r.stop" type="error" variant="tonal" class="mb-4" icon="mdi-alert-octagon-outline">
      <b>Расчёт прерван: {{ r.stop }}.</b> Система автоматически сформировала резолюцию «Отказ».
    </v-alert>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-pad text-center">
          <div class="t-caption mb-3">Скоринговый рейтинг</div>
          <div class="d-flex justify-center">
            <svg viewBox="0 0 168 168" class="score-ring">
              <circle cx="84" cy="84" r="70" fill="none" stroke="#E6EAF2" stroke-width="14" />
              <circle
                cx="84" cy="84" r="70" fill="none" :stroke="ringColor" stroke-width="14" stroke-linecap="round"
                :stroke-dasharray="dash" transform="rotate(-90 84 84)"
              />
              <text x="84" y="92" text-anchor="middle" font-size="40" font-weight="600" fill="#1B2433">{{ r.score }}</text>
              <text x="84" y="114" text-anchor="middle" font-size="12" fill="#667085">из 100</text>
            </svg>
          </div>
          <div class="mt-4"><StatusChip :status="r.status" size="large" /></div>
          <div class="t-caption mt-2">Порог одобрения: {{ THRESHOLD }} баллов</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card class="card-pad">
          <h3 class="mb-4">Риск-факторы</h3>
          <div v-if="!r.factors.length" class="t-caption">Факторы не рассчитывались из-за стоп-фактора.</div>
          <div v-for="f in r.factors" :key="f.key" class="mb-4">
            <div class="d-flex justify-space-between">
              <span><v-icon :icon="f.positive ? 'mdi-arrow-up-circle' : 'mdi-arrow-down-circle'" :color="f.positive ? 'secondary' : 'error'" size="18" class="mr-1" />{{ f.name }}</span>
              <span class="t-caption">{{ f.points }} из {{ f.weight }}</span>
            </div>
            <div class="factor-bar mt-1">
              <span :style="{ width: f.norm * 100 + '%', background: f.positive ? '#0E9F8E' : '#C62828' }" />
            </div>
            <div class="t-caption">{{ f.hint }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="r.factors.length" class="mt-1">
      <v-col cols="12" md="6">
        <v-card class="card-pad" style="border-left: 4px solid #0E9F8E">
          <h3 class="mb-2">Позитивные факторы</h3>
          <div v-if="!positives.length" class="t-caption">Нет</div>
          <div v-for="f in positives" :key="f.key">+ {{ f.name }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="card-pad" style="border-left: 4px solid #C62828">
          <h3 class="mb-2">Негативные факторы</h3>
          <div v-if="!negatives.length" class="t-caption">Нет</div>
          <div v-for="f in negatives" :key="f.key">− {{ f.name }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
