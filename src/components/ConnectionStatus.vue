<template>
  <div class="conn-status">
    <div class="left-group">
      <ion-spinner v-if="isLoading" name="dots" class="conn-spinner" />
      <div class="badge" :class="badgeClass">
        <span class="ledot" />
        {{ label }}
      </div>
    </div>
    <span v-if="formattedTime" class="updated">{{ formattedTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonSpinner } from '@ionic/vue'
import type { ConnectionStatus } from '@/types/airpods.types'

const props = defineProps<{
  status: ConnectionStatus
  lastUpdated?: Date | null
}>()

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  disconnected: 'Déconnecté',
  scanning:     'Recherche...',
  connecting:   'Connexion...',
  connected:    'Connecté',
  error:        'Erreur de connexion',
}

const label = computed(() => STATUS_LABELS[props.status])
const isLoading = computed(() => props.status === 'scanning' || props.status === 'connecting')
const badgeClass = computed(() => props.status === 'connected' ? 'badge--ok' : 'badge--off')

const formattedTime = computed(() =>
  props.lastUpdated
    ? props.lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null,
)
</script>

<style scoped>
.conn-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px 14px;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.conn-spinner {
  width: 16px;
  height: 16px;
  color: var(--ink-2);
}

.updated {
  font-size: 12px;
  color: var(--ink-3);
}

/* Badge pilule verre */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-0);
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
}

.badge--ok {
  background: rgba(52, 199, 89, 0.18);
  border-color: rgba(52, 199, 89, 0.40);
}

.badge--off {
  background: rgba(255, 255, 255, 0.06);
  color: var(--ink-2);
}

.ledot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.badge--ok  .ledot { background: var(--batt-ok);  box-shadow: 0 0 10px rgba(52, 199, 89, 0.7); }
.badge--off .ledot { background: var(--ink-3); }

/* Anneau pulsant autour du point vert */
.badge--ok .ledot::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 1.5px solid var(--batt-ok);
  opacity: 0;
  animation: pulse-ring 2.4s ease-out infinite;
}

@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.8; }
  80%  { transform: scale(2.6); opacity: 0; }
  100% { transform: scale(2.6); opacity: 0; }
}
</style>
