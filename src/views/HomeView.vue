<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>AirAlert</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/settings">
            <ion-icon slot="icon-only" :icon="settingsOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ConnectionStatus :status="status" />
      <EmptyState v-if="!device" @scan="onScan" />
      <AirPodsCard v-else :device="device" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/vue'
import { settingsOutline } from 'ionicons/icons'
import { computed, onMounted } from 'vue'
import { useAirPodsStore } from '@/stores/airpods.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useBluetooth } from '@/composables/useBluetooth'
import { useBatteryMonitor } from '@/composables/useBatteryMonitor'
import AirPodsCard from '@/components/AirPodsCard.vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import EmptyState from '@/components/EmptyState.vue'

const airpodsStore = useAirPodsStore()
const settingsStore = useSettingsStore()
const { initialize, scan } = useBluetooth()
const { start: startMonitor } = useBatteryMonitor()

const device = computed(() => airpodsStore.device)
const status = computed(() => airpodsStore.status)

async function onScan() {
  await scan()
}

onMounted(async () => {
  await settingsStore.load()
  await initialize()
  startMonitor()
})
</script>
