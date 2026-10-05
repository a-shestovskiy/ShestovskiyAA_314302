<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusChip from '../components/StatusChip.vue'
import { state } from '../stores/state'

const router = useRouter()
const apps = computed(() => state.applications)
const approved = computed(() => apps.value.filter((a) => a.status === 'Одобрено').length)
const rejected = computed(() => apps.value.filter((a) => a.status === 'Отказ').length)
const waiting = computed(() => apps.value.filter((a) => a.status === 'Ожидает подписания').length)
const recent = computed(() => apps.value.slice(0, 5))

const kpis = computed(() => [
  { t: 'Заявок в архиве', v: apps.value.length, icon: 'mdi-folder-text-outline', c: 'primary' },
  { t: 'Одобрено', v: approved.value, icon: 'mdi-check-circle-outline', c: 'success' },
  { t: 'Отказано', v: rejected.value, icon: 'mdi-close-circle-outline', c: 'error' },
  { t: 'Ожидают подписания', v: waiting.value, icon: 'mdi-pen', c: 'warning' }
])
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Добро пожаловать, {{ state.user?.fio.split(' ')[1] }}</h1>
        <div class="t-caption">Сводка по кредитным заявкам за текущий месяц</div>
      </div>
      <v-btn color="primary" size="large" prepend-icon="mdi-plus" @click="router.push('/new')">Новая заявка</v-btn>
    </div>

    <v-row>
      <v-col v-for="k in kpis" :key="k.t" cols="12" sm="6" lg="3">
        <v-card class="kpi">
          <div class="d-flex justify-space-between align-center">
            <div class="t-caption">{{ k.t }}</div>
            <v-icon :icon="k.icon" :color="k.c" />
          </div>
          <div class="kpi-v mt-1">{{ k.v }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" lg="8">
        <v-card>
          <div class="d-flex justify-space-between align-center pa-4 pb-2">
            <h3>Последние заявки</h3>
            <v-btn variant="text" color="primary" append-icon="mdi-arrow-right" @click="router.push('/archive')">Весь архив</v-btn>
          </div>
          <v-table>
            <thead>
              <tr><th>№ заявки</th><th>Заёмщик</th><th class="text-right">Сумма, BYN</th><th>Рейтинг</th><th>Статус</th></tr>
            </thead>
            <tbody>
              <tr v-for="a in recent" :key="a.id" style="cursor: pointer" @click="router.push('/archive/' + a.id)">
                <td>{{ a.id }}</td>
                <td>{{ a.fio }}</td>
                <td class="text-right">{{ a.sum.toLocaleString('ru-RU') }}</td>
                <td>{{ a.score }}</td>
                <td><StatusChip :status="a.status" /></td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card class="card-pad">
          <h3 class="mb-4">Быстрые действия</h3>
          <v-btn block variant="tonal" color="primary" class="mb-3" prepend-icon="mdi-file-plus-outline" @click="router.push('/new')">Создать заявку</v-btn>
          <v-btn block variant="tonal" color="primary" class="mb-3" prepend-icon="mdi-magnify" @click="router.push('/archive')">Найти в архиве</v-btn>
          <v-divider class="my-4" />
          <div class="t-caption">Нормативное время обработки одной заявки</div>
          <div class="t-h2 mt-1" style="color: var(--c-primary-dark)">0,4 нормо-часа</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
