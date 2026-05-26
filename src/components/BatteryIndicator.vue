<template>
  <div class="batt-indicator">
    <span class="batt-label">{{ label }}</span>
    <div
      class="batt-wrap"
      :class="levelClass"
      :aria-label="`Batterie ${label} : ${displayValue}`"
    >
      <div class="batt-body">
        <div class="batt-fill" :style="{ width: `${fillPercent}%` }" />
      </div>
      <div class="batt-tip" />
    </div>
    <span class="batt-value">{{ displayValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  level: number | null
}>()

const fillPercent = computed(() =>
  props.level !== null ? Math.max(0, Math.min(100, props.level)) : 0,
)

const displayValue = computed(() => (props.level !== null ? `${props.level}%` : '--'))

const levelClass = computed(() => {
  if (props.level === null) return 'unknown'
  if (props.level <= 5) return 'critical'
  if (props.level <= 15) return 'warning'
  return 'normal'
})
</script>

<style scoped>
.batt-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.batt-label {
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ion-color-medium);
}

.batt-wrap {
  display: flex;
  align-items: center;
  gap: 2px;
}

.batt-body {
  width: 56px;
  height: 28px;
  border: 2.5px solid var(--batt-color, var(--ion-color-medium));
  border-radius: 5px;
  padding: 3px;
  box-sizing: border-box;
  transition: border-color 0.4s ease;
}

.batt-tip {
  width: 4px;
  height: 12px;
  background: var(--batt-color, var(--ion-color-medium));
  border-radius: 0 2px 2px 0;
  transition: background 0.4s ease;
}

.batt-fill {
  height: 100%;
  background: var(--batt-color, var(--ion-color-medium));
  border-radius: 2px;
  transition:
    width 0.6s ease,
    background 0.4s ease;
}

.batt-value {
  font-size: 1.4em;
  font-weight: 700;
  color: var(--batt-color, var(--ion-color-medium));
  transition: color 0.4s ease;
}

.normal {
  --batt-color: var(--ion-color-success);
}

.warning {
  --batt-color: var(--ion-color-warning);
}

.critical {
  --batt-color: var(--ion-color-danger);
  animation: batt-pulse 1.2s ease-in-out infinite;
}

.unknown {
  --batt-color: var(--ion-color-medium);
}

@keyframes batt-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
