<template>
  <ion-page class="glass-page">
    <ion-header class="glass-header" :translucent="true">
      <ion-toolbar>
        <ion-title class="app-title">
          <span class="accent-dot" aria-hidden="true" />AirAlert
        </ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="device" class="icon-btn" @click="onDisconnect">
            <ion-icon slot="icon-only" :icon="powerOutline" />
          </ion-button>
          <ion-button class="icon-btn" router-link="/settings">
            <ion-icon slot="icon-only" :icon="settingsOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ion-refresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <div class="screen-body">
        <ConnectionStatus :status="status" />

        <Transition name="fade" mode="out-in">
          <EmptyState v-if="!device" key="empty" @scan="onScan" />
          <AirPodsCard v-else :key="device.id" :device="device" />
        </Transition>
      </div>
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

async function onScan() { await scan() }
async function onDisconnect() { if (device.value) await disconnect(device.value.id) }

async function onRefresh(event: CustomEvent) {
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
/* Fond dégradé profond sur toute la page */
.glass-page {
  background: var(--screen-bg);
}

ion-content {
  --background: var(--screen-bg);
}

/* Header transparent + blur */
.glass-header {
  --background: transparent;
}

ion-toolbar {
  --background: transparent;
  --border-width: 0;
  --color: var(--ink-0);
  padding-top: env(safe-area-inset-top);
}

/* Titre avec point lumineux accent */
.app-title {
  --color: var(--ink-0);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
}

.accent-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
  margin-right: 8px;
  vertical-align: 2px;
}

/* Boutons icône circulaires verre */
.icon-btn {
  --background: var(--glass-bg);
  --background-activated: var(--glass-bg-strong);
  --border-radius: 50%;
  --border-width: 1px;
  --border-style: solid;
  --border-color: var(--glass-border-soft);
  --color: var(--ink-1);
  --box-shadow: none;
  --padding-start: 0;
  --padding-end: 0;
  width: 38px;
  height: 38px;
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}

/* Contenu scrollable */
.screen-body {
  padding: 8px 20px 20px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Transitions entre empty state et carte */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
