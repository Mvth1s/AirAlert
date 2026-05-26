<template>
  <div class="connection-status ion-text-center ion-padding-bottom">
    <ion-badge :color="badgeColor">{{ label }}</ion-badge>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonBadge } from '@ionic/vue'
import type { ConnectionStatus } from '@/types/airpods.types'

const props = defineProps<{ status: ConnectionStatus }>()

const STATUS_LABELS: Record<ConnectionStatus, string> = {
  disconnected: 'Déconnecté',
  scanning: 'Recherche...',
  connecting: 'Connexion...',
  connected: 'Connecté',
  error: 'Erreur',
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
</script>
