<script setup>
import { computed } from 'vue'

const props = defineProps({ status: String })
const color = computed(
  () =>
    ({ Одобрено: 'success', Отказ: 'error', 'Ожидает подписания': 'warning', 'На рассмотрении': 'info' })[props.status] ?? 'default'
)
</script>

<template>
  <v-chip :color="color" variant="tonal" label>{{ status }}</v-chip>
</template>
