<template>
  <div class="batt-indicator" :class="levelClass">
    <div class="gauge-head">
      <span class="batt-label">{{ label }}</span>
      <span class="batt-value">
        {{ level !== null ? level : '--' }}<span class="batt-unit">%</span>
      </span>
    </div>
    <div
      class="batt-wrap"
      :aria-label="`Batterie ${label} : ${level !== null ? level + '%' : 'inconnue'}`"
    >
      <div class="batt-body">
        <div class="batt-fill" :style="{ width: `${fillPercent}%` }" />
      </div>
    </div>
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

const levelClass = computed(() => {
  if (props.level === null) return 'unknown'
  if (props.level <= 5) return 'critical'
  if (props.level <= 15) return 'warning'
  return 'normal'
})
</script>

<style scoped>
/* Panneau de jauge */
.batt-indicator {
  flex: 1;
  padding: 16px 16px 14px;
  border-radius: 22px;
  background: var(--inner-bg);
  border: 1px solid var(--inner-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: background 400ms var(--ease-out-soft), border-color 400ms var(--ease-out-soft);
}

.gauge-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.batt-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
  font-weight: 500;
}

.batt-value {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-0);
  font-variant-numeric: tabular-nums;
  transition: color 300ms;
}

.batt-unit {
  font-size: 13px;
  color: var(--ink-3);
  margin-left: 2px;
}

/* Corps de la batterie */
.batt-wrap {
  position: relative;
}

.batt-body {
  width: 100%;
  height: 26px;
  border-radius: 8px;
  border: 1.5px solid var(--batt-frame);
  background: var(--batt-bg);
  padding: 3px;
  box-sizing: border-box;
  position: relative;
  overflow: visible;
  transition: border-color 300ms;
}

/* Tip de la batterie */
.batt-body::after {
  content: '';
  position: absolute;
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 10px;
  background: var(--batt-frame);
  border-radius: 2px;
  transition: background 300ms;
}

.batt-fill {
  height: 100%;
  border-radius: 5px;
  /* Transition pour les mises à jour de niveau ; animation initiale via clip-path */
  transition: width 1100ms var(--ease-out-soft), background 0.4s ease;
  animation: fill-reveal 1100ms var(--ease-out-soft) both;
  box-shadow: 0 0 12px currentColor;
  position: relative;
  overflow: hidden;
}

/* Brillance liquide intérieure */
.batt-fill::before {
  content: '';
  position: absolute;
  top: 0; bottom: 50%; left: 8%; right: 8%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), transparent);
  border-radius: 4px 4px 8px 8px;
  pointer-events: none;
}

@keyframes fill-reveal {
  from { clip-path: inset(0 100% 0 0 round 5px); }
}

/* États de couleur — utilise les tokens pour s'adapter au thème */
.normal   { color: var(--batt-ok-glow); }
.warning  { color: var(--batt-warn-glow); }
.critical { color: var(--batt-danger-glow); }
.unknown  { color: var(--ink-4); }

.normal   .batt-fill { background: var(--batt-ok); }
.warning  .batt-fill { background: var(--batt-warn); }
.critical .batt-fill { background: var(--batt-danger); animation: danger-pulse 1.6s ease-in-out infinite, fill-reveal 1100ms var(--ease-out-soft) both; }
.unknown  .batt-fill { background: var(--ink-4); }

.normal   .batt-body { border-color: rgba(52, 199, 89, 0.35); }
.warning  .batt-body { border-color: rgba(255, 159, 10, 0.35); }
.critical .batt-body { border-color: rgba(255, 59, 48, 0.35); }

/* Pulse lumineux sur critique (glow, pas opacité) */
@keyframes danger-pulse {
  0%, 100% { box-shadow: 0 0 12px currentColor; }
  50%      { box-shadow: 0 0 22px currentColor, 0 0 36px currentColor; }
}
</style>
