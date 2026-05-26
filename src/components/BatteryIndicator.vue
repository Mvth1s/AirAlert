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
/* Panneau de jauge — copie du .gauge de la maquette */
.batt-indicator {
  flex: 1;
  padding: 16px 16px 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.10);
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  border: 1.5px solid rgba(255, 255, 255, 0.30);
  background: rgba(255, 255, 255, 0.06);
  padding: 3px;
  box-sizing: border-box;
  /* Tip sur la droite via pseudo-element */
  position: relative;
  overflow: visible;
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
  background: rgba(255, 255, 255, 0.30);
  border-radius: 2px;
}

.batt-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.4s ease, background 0.4s ease;
  /* Glow identique à la maquette */
  box-shadow: 0 0 12px currentColor;
}

/* États de couleur */
.normal   { --batt-color: var(--batt-ok);     color: rgba(52, 199, 89, 0.55); }
.warning  { --batt-color: var(--batt-warn);   color: rgba(255, 159, 10, 0.55); }
.critical { --batt-color: var(--batt-danger); color: rgba(255, 59, 48, 0.55);
  animation: batt-pulse 1.2s ease-in-out infinite; }
.unknown  { --batt-color: var(--ink-4); color: var(--ink-4); }

.normal   .batt-fill { background: var(--batt-ok); }
.warning  .batt-fill { background: var(--batt-warn); }
.critical .batt-fill { background: var(--batt-danger); }
.unknown  .batt-fill { background: var(--ink-4); }

.normal   .batt-body { border-color: rgba(52, 199, 89, 0.35); }
.warning  .batt-body { border-color: rgba(255, 159, 10, 0.35); }
.critical .batt-body { border-color: rgba(255, 59, 48, 0.35); }

@keyframes batt-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.45; }
}
</style>
