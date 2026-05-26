<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ device.name }}</ion-card-title>
      <ion-card-subtitle v-if="device.lastUpdated">
        Mis à jour à {{ formattedTime }}
      </ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <div class="battery-row">
        <BatteryIndicator label="Gauche" :level="device.battery.left" />
        <BatteryIndicator label="Droite" :level="device.battery.right" />
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'
import { computed } from 'vue'
import type { AirPodsDevice } from '@/types/airpods.types'
import BatteryIndicator from './BatteryIndicator.vue'

const props = defineProps<{ device: AirPodsDevice }>()

const formattedTime = computed(() =>
  props.device.lastUpdated
    ? props.device.lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null,
)
</script>

<style scoped>
.battery-row {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
}
</style>
