<template>
  <ion-card class="airpods-card">
    <ion-card-header>
      <div class="card-header-row">
        <ion-icon :icon="headsetOutline" class="device-icon" />
        <div class="card-header-text">
          <ion-card-title>{{ device.name }}</ion-card-title>
          <ion-card-subtitle v-if="formattedTime">Mis à jour à {{ formattedTime }}</ion-card-subtitle>
        </div>
      </div>
    </ion-card-header>

    <ion-card-content>
      <div class="battery-row">
        <BatteryIndicator label="Gauche" :level="device.battery.left" />
        <div class="divider" />
        <BatteryIndicator label="Droite" :level="device.battery.right" />
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon } from '@ionic/vue'
import { headsetOutline } from 'ionicons/icons'
import { computed } from 'vue'
import type { AirPodsDevice } from '@/types/airpods.types'
import BatteryIndicator from './BatteryIndicator.vue'

const props = defineProps<{ device: AirPodsDevice }>()

const formattedTime = computed(() =>
  props.device.lastUpdated
    ? props.device.lastUpdated.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null,
)
</script>

<style scoped>
.airpods-card {
  margin: 0;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-icon {
  font-size: 2.2rem;
  color: var(--ion-color-primary);
  flex-shrink: 0;
}

.card-header-text {
  flex: 1;
}

.battery-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 8px 8px;
}

.divider {
  width: 1px;
  height: 60px;
  background: var(--ion-color-light-shade);
}
</style>
