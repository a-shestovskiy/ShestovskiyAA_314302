<script setup>
import { computed, ref } from 'vue'
import { state } from '../stores/state'

const type = ref('Все')
const level = ref('Все')
const types = computed(() => ['Все', ...new Set(state.audit.map((e) => e.type))])
const levels = ['Все', 'info', 'warn', 'error']
const levelName = { info: 'Информация', warn: 'Предупреждение', error: 'Ошибка' }
const levelColor = { info: 'info', warn: 'warning', error: 'error' }

const rows = computed(() =>
  state.audit.filter((e) => (type.value === 'Все' || e.type === type.value) && (level.value === 'Все' || e.level === level.value))
)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Журнал системного аудита</h1>
        <div class="t-caption">Действия пользователей и состояние интеграций</div>
      </div>
    </div>

    <v-card class="card-pad mb-4">
      <v-row dense>
        <v-col cols="12" md="5">
          <div class="field-label">Тип события</div>
          <v-select v-model="type" :items="types" />
        </v-col>
        <v-col cols="12" md="4">
          <div class="field-label">Уровень</div>
          <v-select v-model="level" :items="levels" :item-title="(l) => levelName[l] ?? l" />
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-table>
        <thead>
          <tr><th>Время</th><th>Пользователь</th><th>Тип</th><th>Описание</th><th>Уровень</th></tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in rows" :key="i">
            <td style="white-space: nowrap">{{ e.time }}</td>
            <td>{{ e.user }}</td>
            <td>{{ e.type }}</td>
            <td>{{ e.msg }}</td>
            <td><v-chip :color="levelColor[e.level]" variant="tonal" label>{{ levelName[e.level] }}</v-chip></td>
          </tr>
          <tr v-if="!rows.length"><td colspan="5" class="text-center t-caption pa-6">За выбранный период события отсутствуют.</td></tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>
