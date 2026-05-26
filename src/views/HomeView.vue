<template>
  <ion-page class="glass-page">
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ion-refresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <div class="screen-body">
        <div class="bg-glow" aria-hidden="true" />

        <!-- Header custom (identique à la maquette) -->
        <div class="app-header">
          <div class="app-title">
            <span class="accent-dot" aria-hidden="true" />AirAlert
          </div>
          <div class="icon-row">
            <ion-button
              class="icon-btn"
              :aria-label="isDark ? 'Passer en thème clair' : 'Passer en thème sombre'"
              @click="toggleTheme"
            >
              <ion-icon slot="icon-only" :icon="isDark ? sunnyOutline : moonOutline" />
            </ion-button>
            <ion-button v-if="device" class="icon-btn" aria-label="Déconnecter" @click="onDisconnect">
              <ion-icon slot="icon-only" :icon="powerOutline" />
            </ion-button>
            <ion-button class="icon-btn" router-link="/settings" aria-label="Paramètres">
              <ion-icon slot="icon-only" :icon="settingsOutline" />
            </ion-button>
          </div>
        </div>

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
  IonContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue'
import { settingsOutline, powerOutline, sunnyOutline, moonOutline } from 'ionicons/icons'
import { computed, onMounted } from 'vue'
import { useAirPodsStore } from '@/stores/airpods.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useBluetooth } from '@/composables/useBluetooth'
import { useBatteryMonitor } from '@/composables/useBatteryMonitor'
import { useTheme } from '@/composables/useTheme'
import AirPodsCard from '@/components/AirPodsCard.vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import EmptyState from '@/components/EmptyState.vue'

const airpodsStore = useAirPodsStore()
const settingsStore = useSettingsStore()
const { initialize, scan, disconnect } = useBluetooth()
const { start: startMonitor } = useBatteryMonitor()
const { isDark, toggleTheme } = useTheme()

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
.glass-page {
  background: var(--screen-bg);
}

ion-content {
  --background: var(--screen-bg);
}

/* ─── Contenu scrollable avec safe area ─────────────────────────────────── */
.screen-body {
  padding: calc(env(safe-area-inset-top) + 14px) 20px calc(env(safe-area-inset-bottom) + 20px);
  display: flex;
  flex-direction: column;
  min-height: 100%;
  position: relative;
  isolation: isolate;
  animation: screen-in 520ms var(--ease-out-soft) both;
}

/* ─── Header custom ──────────────────────────────────────────────────────── */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 18px;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-0);
  display: inline-flex;
  align-items: center;
}

.accent-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
  margin-right: 10px;
  animation: accent-breathe 3.6s ease-in-out infinite;
}

@keyframes accent-breathe {
  0%, 100% { box-shadow: 0 0 10px var(--accent-glow); transform: scale(1); }
  50%      { box-shadow: 0 0 18px var(--accent-glow), 0 0 30px var(--accent-soft); transform: scale(1.15); }
}

.icon-row {
  display: flex;
  gap: 10px;
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
  transition: --background 300ms, --border-color 300ms;
}

/* ─── Lueur ambiante dérivante ───────────────────────────────────────────── */
.bg-glow {
  position: absolute;
  inset: -10%;
  pointer-events: none;
  z-index: -1;
  background:
    radial-gradient(400px 300px at 70% 20%, var(--accent-soft), transparent 60%),
    radial-gradient(360px 280px at 20% 80%, rgba(200, 120, 255, 0.18), transparent 60%);
  filter: blur(8px);
  animation: ambient-drift 18s ease-in-out infinite alternate;
}

@keyframes ambient-drift {
  0%   { transform: translate(0, 0)    scale(1);    opacity: 0.9; }
  50%  { transform: translate(-3%, 2%) scale(1.08); opacity: 1; }
  100% { transform: translate(3%, -2%) scale(1.04); opacity: 0.9; }
}

/* ─── Entrée de page ─────────────────────────────────────────────────────── */
@keyframes screen-in {
  from { opacity: 0; transform: translateY(10px) scale(0.985); filter: blur(8px); }
  to   { opacity: 1; transform: none;                         filter: blur(0); }
}

/* Stagger d'apparition pour les composants enfants */
:deep(.conn-status) {
  animation: anim-rise 600ms var(--ease-out-soft) both;
}

:deep(.airpods-card),
:deep(.empty-state) {
  animation: anim-rise 600ms var(--ease-out-soft) 80ms both;
}

@keyframes anim-rise {
  from { opacity: 0; transform: translateY(12px); filter: blur(8px); }
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
