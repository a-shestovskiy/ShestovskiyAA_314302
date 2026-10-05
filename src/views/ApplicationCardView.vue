<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusChip from '../components/StatusChip.vue'
import { state } from '../stores/state'

const route = useRoute()
const router = useRouter()
const app = computed(() => state.applications.find((a) => a.id === route.params.id))

const history = computed(() => {
  if (!app.value) return []
  const h = [
    { t: app.value.date + ' 09:12', e: 'Заявка создана, данные получены из реестров', icon: 'mdi-file-plus-outline', c: 'primary' },
    { t: app.value.date + ' 09:13', e: `Рассчитан рейтинг ${app.value.score}`, icon: 'mdi-calculator-variant-outline', c: 'primary' },
    { t: app.value.date + ' 09:14', e: `Присвоен статус «${app.value.status === 'Отказ' ? 'Отказ' : 'Одобрено'}»`, icon: app.value.status === 'Отказ' ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline', c: app.value.status === 'Отказ' ? 'error' : 'success' }
  ]
  if (app.value.status === 'Ожидает подписания') h.push({ t: app.value.date + ' 10:02', e: 'Пакет документов сформирован', icon: 'mdi-file-document-outline', c: 'warning' })
  return h
})
</script>

<template>
  <div v-if="app" class="page">
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2" @click="router.push('/archive')">К архиву</v-btn>
    <div class="page-head">
      <div>
        <h1>Заявка {{ app.id }}</h1>
        <div class="t-caption">от {{ app.date }}</div>
      </div>
      <div class="d-flex ga-3 align-center">
        <StatusChip :status="app.status" />
        <v-btn v-if="app.status !== 'Отказ'" color="primary" prepend-icon="mdi-file-document-outline" @click="router.push('/documents/' + app.id)">Документы</v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="card-pad">
          <h3 class="mb-4">Данные заявки</h3>
          <v-row dense>
            <v-col cols="6"><div class="field-label">Заёмщик</div>{{ app.fio }}</v-col>
            <v-col cols="6"><div class="field-label">УНП</div>{{ app.unp }}</v-col>
            <v-col cols="4" class="mt-3"><div class="field-label">Сумма</div>{{ app.sum.toLocaleString('ru-RU') }} BYN</v-col>
            <v-col cols="4" class="mt-3"><div class="field-label">Срок</div>{{ app.months }} мес.</v-col>
            <v-col cols="4" class="mt-3"><div class="field-label">Рейтинг</div>{{ app.score }} из 100</v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="5">
        <v-card class="card-pad">
          <h3 class="mb-4">История статусов</h3>
          <v-timeline density="compact" side="end" line-thickness="2">
            <v-timeline-item v-for="h in history" :key="h.t" :dot-color="h.c" size="small" :icon="h.icon">
              <div class="t-caption">{{ h.t }}</div>
              <div>{{ h.e }}</div>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else class="page"><v-alert type="warning" variant="tonal">Заявка не найдена.</v-alert></div>
</template>
