<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>AirAlert</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="device" @click="onDisconnect">
            <ion-icon slot="icon-only" :icon="powerOutline" />
          </ion-button>
          <ion-button router-link="/settings">
            <ion-icon slot="icon-only" :icon="settingsOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" @ion-refresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <ConnectionStatus :status="status" />

      <Transition name="fade" mode="out-in">
        <EmptyState v-if="!device" key="empty" @scan="onScan" />
        <AirPodsCard v-else :key="device.id" :device="device" />
      </Transition>
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
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue'
import { settingsOutline, powerOutline } from 'ionicons/icons'
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
const { initialize, scan, disconnect } = useBluetooth()
const { start: startMonitor } = useBatteryMonitor()

const device = computed(() => airpodsStore.device)
const status = computed(() => airpodsStore.status)

async function onScan() {
  await scan()
}

async function onDisconnect() {
  if (device.value) await disconnect(device.value.id)
}

async function onRefresh(event: CustomEvent) {
  // Le polling se charge de la mise à jour — on attend juste un instant
  await new Promise((r) => setTimeout(r, 800))
  ;(event.target as HTMLIonRefresherElement).complete()
}

onMounted(async () => {
  await settingsStore.load()
  await initialize()
  startMonitor()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
