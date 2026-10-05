<script setup>
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import StatusChip from '../components/StatusChip.vue'
import { state } from '../stores/state'

const router = useRouter()
const { xs, smAndDown } = useDisplay()
const q = ref('')
const status = ref('Все')
const statuses = ['Все', 'Одобрено', 'Отказ', 'Ожидает подписания']

const rows = computed(() =>
  state.applications.filter(
    (a) =>
      (status.value === 'Все' || a.status === status.value) &&
      (!q.value || (a.fio + a.id).toLowerCase().includes(q.value.toLowerCase()))
  )
)

const allHeaders = [
  { title: '№ заявки', key: 'id' },
  { title: 'Дата', key: 'date' },
  { title: 'Заёмщик', key: 'fio' },
  { title: 'Сумма, BYN', key: 'sum', align: 'end' },
  { title: 'Срок, мес.', key: 'months', align: 'end' },
  { title: 'Рейтинг', key: 'score', align: 'end' },
  { title: 'Статус', key: 'status' }
]
// на планшете остаются ключевые колонки
const headers = computed(() => (smAndDown.value ? allHeaders.filter((h) => ['id', 'fio', 'score', 'status'].includes(h.key)) : allHeaders))
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Архив заявок</h1>
        <div class="t-caption">Поиск и просмотр ранее обработанных кредитных дел</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/new')">Новая заявка</v-btn>
    </div>

    <v-card class="mb-4 card-pad">
      <v-row dense align="end">
        <v-col cols="12" md="6">
          <div class="field-label">ФИО или номер заявки</div>
          <v-text-field v-model="q" prepend-inner-icon="mdi-magnify" placeholder="Например, Иванов или ЗК-2026-0412" clearable />
        </v-col>
        <v-col cols="12" md="4">
          <div class="field-label">Статус</div>
          <v-select v-model="status" :items="statuses" />
        </v-col>
        <v-col cols="12" md="2">
          <v-btn block variant="outlined" size="large" @click="((q = ''), (status = 'Все'))">Сбросить</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div v-if="xs">
      <v-card v-for="a in rows" :key="a.id" class="card-pad mb-3" style="cursor: pointer" @click="router.push('/archive/' + a.id)">
        <div class="d-flex justify-space-between align-center mb-1">
          <b>{{ a.id }}</b>
          <StatusChip :status="a.status" />
        </div>
        <div>{{ a.fio }}</div>
        <div class="t-caption">{{ a.date }} · {{ a.sum.toLocaleString('ru-RU') }} BYN · {{ a.months }} мес. · рейтинг {{ a.score }}</div>
      </v-card>
      <v-alert v-if="!rows.length" type="info" variant="tonal">Заявок не найдено. Измените параметры поиска.</v-alert>
    </div>
    <v-card v-else>
      <v-data-table
        :headers="headers"
        :items="rows"
        item-value="id"
        items-per-page="8"
        hover
        no-data-text="Заявок не найдено. Измените параметры поиска."
        items-per-page-text="Строк на странице"
        @click:row="(_, { item }) => router.push('/archive/' + item.id)"
      >
        <template #item.sum="{ item }">{{ item.sum.toLocaleString('ru-RU') }}</template>
        <template #item.status="{ item }"><StatusChip :status="item.status" /></template>
      </v-data-table>
    </v-card>
  </div>
</template>
