<script setup>
import { palette } from '../theme'

const type = [
  { n: 'Заголовок 1', s: '28 / 36 px, 600', c: 't-h1', t: 'Заголовок страницы' },
  { n: 'Заголовок 2', s: '22 / 30 px, 600', c: 't-h2', t: 'Заголовок раздела' },
  { n: 'Заголовок 3', s: '18 / 26 px, 600', c: 't-h3', t: 'Заголовок карточки' },
  { n: 'Основной текст', s: '14 / 22 px, 400', c: 't-body', t: 'Основной текст интерфейса и таблиц' },
  { n: 'Подпись', s: '12 / 18 px, 400', c: 't-caption', t: 'Подсказки и вспомогательный текст' }
]
const spacing = [4, 8, 16, 24, 32, 48]
const statuses = ['Одобрено', 'Отказ', 'Ожидает подписания']
const statusColor = { Одобрено: 'success', Отказ: 'error', 'Ожидает подписания': 'warning' }
</script>

<template>
  <div class="page ds">
    <h1 class="mb-1">Система дизайна «РискСкоринг»</h1>
    <div class="t-caption mb-6">Цвет, типографика, сетка, компоненты</div>

    <h2 class="mb-3" id="colors">1. Цветовая палитра</h2>
    <v-row class="mb-6">
      <v-col v-for="c in palette" :key="c.token" cols="6" sm="4" md="3" lg="2">
        <v-card>
          <div :style="{ background: c.hex, height: '64px', borderBottom: '1px solid #D8DEE9' }" />
          <div class="pa-3">
            <div style="font-weight: 600">{{ c.name }}</div>
            <div class="t-caption">{{ c.hex }}</div>
            <div class="t-caption">{{ c.use }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <h2 class="mb-3" id="type">2. Типографика</h2>
    <v-card class="card-pad mb-6">
      <div class="t-caption mb-3">Гарнитура: Inter (запасная — Segoe UI, Roboto, Arial)</div>
      <div v-for="t in type" :key="t.n" class="d-flex align-baseline ga-6 py-2" style="border-bottom: 1px solid #EEF2F8">
        <div style="width: 160px" class="t-caption">{{ t.n }}<br />{{ t.s }}</div>
        <div :class="t.c">{{ t.t }}</div>
      </div>
    </v-card>

    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <h2 class="mb-3" id="grid">3. Сетка и отступы</h2>
        <v-card class="card-pad">
          <ul class="mb-4" style="padding-left: 20px">
            <li>Адаптивная 12-колоночная сетка, межколоночный отступ 24 px</li>
            <li>Боковое меню 248 px, верхняя панель 64 px</li>
            <li>Максимальная ширина контента 1440 px, поля страницы 32 px</li>
            <li>Брейкпоинты: 600, 960, 1280, 1920 px</li>
            <li>Скругление элементов 8 px, базовая единица отступа 8 px</li>
          </ul>
          <div class="d-flex align-end ga-3">
            <div v-for="s in spacing" :key="s" class="text-center">
              <div :style="{ width: s + 'px', height: s + 'px', background: '#1F4E9C', margin: '0 auto' }" />
              <div class="t-caption">{{ s }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="mb-3" id="status">4. Статусы</h2>
        <v-card class="card-pad">
          <div class="d-flex ga-3 flex-wrap mb-4">
            <v-chip v-for="s in statuses" :key="s" :color="statusColor[s]" variant="tonal" label>{{ s }}</v-chip>
          </div>
          <div class="t-caption mb-2">Позитивный и негативный риск-фактор</div>
          <div class="factor-bar mb-2"><span style="width: 80%; background: #0E9F8E" /></div>
          <div class="factor-bar"><span style="width: 30%; background: #C62828" /></div>
        </v-card>
      </v-col>
    </v-row>

    <h2 class="mb-3" id="components">5. Компоненты</h2>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="card-pad">
          <div class="t-caption mb-3">Кнопки</div>
          <div class="d-flex ga-3 flex-wrap mb-6">
            <v-btn color="primary">Основная</v-btn>
            <v-btn variant="outlined" color="primary">Вторичная</v-btn>
            <v-btn variant="tonal" color="primary">Тональная</v-btn>
            <v-btn variant="text" color="primary">Текстовая</v-btn>
            <v-btn color="error">Опасная</v-btn>
            <v-btn disabled>Недоступна</v-btn>
          </div>
          <div class="t-caption mb-3">Поля ввода</div>
          <div class="field-label">Обычное</div>
          <v-text-field model-value="190456789" class="mb-3" />
          <div class="field-label">С ошибкой</div>
          <v-text-field model-value="12ab" error-messages="УНП состоит из 9 цифр" />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="card-pad">
          <div class="t-caption mb-3">Уведомления</div>
          <v-alert type="success" variant="tonal" class="mb-3" density="compact">Данные получены из реестров</v-alert>
          <v-alert type="warning" variant="tonal" class="mb-3" density="compact">Повторная попытка подключения 2 из 3</v-alert>
          <v-alert type="error" variant="tonal" class="mb-3" density="compact">Внешняя база недоступна</v-alert>
          <v-alert type="info" variant="tonal" density="compact">Заявок не найдено</v-alert>
          <div class="t-caption my-3">Иконки: Material Design Icons, 18–24 px</div>
          <div class="d-flex ga-4">
            <v-icon icon="mdi-file-plus-outline" /><v-icon icon="mdi-archive-outline" /><v-icon icon="mdi-tune-variant" />
            <v-icon icon="mdi-account-cog-outline" /><v-icon icon="mdi-clipboard-text-clock-outline" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
