<template>
  <div class="conn-status">
    <ion-spinner v-if="isLoading" name="dots" class="conn-spinner" />
    <ion-badge :color="badgeColor">{{ label }}</ion-badge>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonBadge, IonSpinner } from '@ionic/vue'
import type { ConnectionStatus } from '@/types/airpods.types'

const props = defineProps<{ status: ConnectionStatus }>()

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  disconnected: 'Déconnecté',
  scanning: 'Recherche...',
  connecting: 'Connexion...',
  connected: 'Connecté',
  error: 'Erreur de connexion',
}

const STATUS_COLORS: Record<ConnectionStatus, string> = {
  disconnected: 'medium',
  scanning: 'warning',
  connecting: 'warning',
  connected: 'success',
  error: 'danger',
}

const label = computed(() => STATUS_LABELS[props.status])
const badgeColor = computed(() => STATUS_COLORS[props.status])
const isLoading = computed(() => props.status === 'scanning' || props.status === 'connecting')
</script>

<style scoped>
.conn-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-bottom: 12px;
}

.conn-spinner {
  width: 16px;
  height: 16px;
}
</style>
