<template>
  <div class="conn-status">
    <ion-spinner v-if="isLoading" name="dots" class="conn-spinner" />
    <div class="badge" :class="badgeClass">
      <span class="ledot" />
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonSpinner } from '@ionic/vue'
import type { ConnectionStatus } from '@/types/airpods.types'

const props = defineProps<{ status: ConnectionStatus }>()

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
</script>

<style scoped>
.conn-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 4px 14px;
}

.conn-spinner {
  width: 16px;
  height: 16px;
  color: var(--ink-2);
}

/* Badge pilule verre — reprend exactement le .badge de la maquette */
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
}

.badge--ok  .ledot { background: var(--batt-ok);  box-shadow: 0 0 10px rgba(52, 199, 89, 0.7); }
.badge--off .ledot { background: var(--ink-3); }
</style>
