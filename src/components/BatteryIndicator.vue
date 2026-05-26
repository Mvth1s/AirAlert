<template>
  <div class="battery-indicator" :class="levelClass">
    <span class="label">{{ label }}</span>
    <span class="value">{{ level !== null ? `${level}%` : '--' }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  level: number | null
}>()

const levelClass = computed(() => {
  if (props.level === null) return 'unknown'
  if (props.level <= 5) return 'critical'
  if (props.level <= 15) return 'warning'
  return 'normal'
})
</script>

<style scoped>
.battery-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.label {
  font-size: 0.85em;
  color: var(--ion-color-medium);
}

.value {
  font-size: 1.5em;
  font-weight: bold;
}

.normal .value {
  color: var(--ion-color-success);
}

.warning .value {
  color: var(--ion-color-warning);
}

.critical .value {
  color: var(--ion-color-danger);
}
</style>
