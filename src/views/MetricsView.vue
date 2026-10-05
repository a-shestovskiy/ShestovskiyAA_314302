<script setup>
import { computed, reactive, ref } from 'vue'
import { FACTORS, THRESHOLD } from '../stores/scoring'
import { logEvent, state } from '../stores/state'

const draft = reactive({ ...state.weights })
const saved = ref(false)

const total = computed(() => Object.values(draft).reduce((s, v) => s + (Number(v) || 0), 0))
const errors = computed(() => {
  const e = {}
  for (const f of FACTORS) {
    const v = Number(draft[f.key])
    if (Number.isNaN(v) || v < 0) e[f.key] = 'Вес не может быть отрицательным'
    else if (v > 50) e[f.key] = 'Допустимый диапазон: 0–50'
  }
  return e
})
const sumError = computed(() => (total.value !== 100 ? `Сумма весов должна равняться 100 (сейчас ${total.value})` : ''))
const valid = computed(() => !Object.keys(errors.value).length && !sumError.value)

function apply() {
  for (const f of FACTORS) {
    if (state.weights[f.key] !== Number(draft[f.key])) {
      logEvent('Калибровка', `Вес «${f.name}» изменён с ${state.weights[f.key]} на ${draft[f.key]}`)
      state.weights[f.key] = Number(draft[f.key])
    }
  }
  saved.value = true
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Настройки риск-метрик</h1>
        <div class="t-caption">Весовые коэффициенты скоринговой модели; изменения применяются ко всем последующим расчётам</div>
      </div>
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="card-pad">
          <div v-for="f in FACTORS" :key="f.key" class="mb-5">
            <div class="d-flex justify-space-between">
              <div class="field-label">{{ f.name }} <span>· {{ f.hint }}</span></div>
            </div>
            <div class="d-flex align-center ga-4">
              <v-slider v-model="draft[f.key]" :min="0" :max="50" :step="1" color="primary" hide-details style="flex: 1" @update:model-value="saved = false" />
              <v-text-field
                v-model.number="draft[f.key]"
                type="number"
                :error-messages="errors[f.key]"
                style="max-width: 120px"
                @update:model-value="saved = false"
              />
            </div>
          </div>
          <v-alert v-if="sumError" type="error" variant="tonal" density="compact" class="mb-4">{{ sumError }}</v-alert>
          <v-alert v-if="saved" type="success" variant="tonal" density="compact" class="mb-4">Конфигурация сохранена и применена без перезагрузки сервера.</v-alert>
          <div class="d-flex justify-end ga-3">
            <v-btn variant="outlined" @click="Object.assign(draft, state.weights)">Отменить</v-btn>
            <v-btn color="primary" :disabled="!valid" prepend-icon="mdi-check" @click="apply">Применить изменения</v-btn>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card class="card-pad">
          <div class="t-caption">Сумма весов</div>
          <div class="kpi-v" :style="{ color: total === 100 ? 'var(--c-success)' : 'var(--c-error)', fontSize: '40px', lineHeight: '52px' }">{{ total }} / 100</div>
          <v-divider class="my-4" />
          <div class="t-caption">Порог одобрения</div>
          <div class="t-h2">{{ THRESHOLD }} баллов</div>
          <div class="t-caption mt-3">Стоп-факторы (банкротство) приводят к отказу независимо от баллов.</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
