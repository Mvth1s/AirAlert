<template>
  <ion-page class="glass-page">
    <ion-content :fullscreen="true">
      <div class="onboarding-wrap">
        <!-- Indicateur de progression -->
        <div class="progress-dots" role="progressbar" :aria-valuenow="step" aria-valuemin="1" :aria-valuemax="TOTAL_STEPS">
          <span
            v-for="i in TOTAL_STEPS"
            :key="i"
            class="dot"
            :class="{ active: step === i, done: step > i }"
          />
        </div>

        <!-- Étapes -->
        <Transition :name="transitionName" mode="out-in">
          <!-- Étape 1 : Bienvenue -->
          <div v-if="step === 1" key="1" class="ob-body">
            <div class="ob-illu welcome">
              <ion-icon :icon="headsetOutline" class="ob-icon" />
            </div>
            <h1 class="ob-title">Bienvenue sur AirAlert</h1>
            <p class="ob-text">
              Recevez une alerte dès que la batterie de vos AirPods descend sous un seuil défini.
              Aucune donnée ne quitte votre appareil.
            </p>
            <div class="ob-actions">
              <ion-button expand="block" class="btn-primary" @click="next">
                Autoriser les permissions
              </ion-button>
              <button class="ob-link">En savoir plus</button>
            </div>
          </div>

          <!-- Étape 2 : Bluetooth -->
          <div v-else-if="step === 2" key="2" class="ob-body">
            <div class="ob-illu bluetooth">
              <ion-icon :icon="bluetoothOutline" class="ob-icon" />
            </div>
            <h2 class="ob-title">Bluetooth</h2>
            <p class="ob-text">
              AirAlert a besoin du Bluetooth pour détecter vos AirPods et lire leur niveau de
              batterie en arrière-plan.
            </p>
            <div class="ob-actions">
              <ion-button expand="block" class="btn-primary" :disabled="loading" @click="requestBluetooth">
                <ion-spinner v-if="loading" slot="start" name="crescent" />
                Autoriser le Bluetooth
              </ion-button>
              <button class="ob-link" @click="next">Passer cette étape</button>
            </div>
          </div>

          <!-- Étape 3 : Notifications -->
          <div v-else-if="step === 3" key="3" class="ob-body">
            <div class="ob-illu notifications">
              <ion-icon :icon="notificationsOutline" class="ob-icon" />
            </div>
            <h2 class="ob-title">Notifications</h2>
            <p class="ob-text">
              Recevez une alerte au bon moment, même quand l'application est en arrière-plan.
            </p>
            <div class="ob-actions">
              <ion-button expand="block" class="btn-primary" :disabled="loading" @click="requestNotifications">
                <ion-spinner v-if="loading" slot="start" name="crescent" />
                Autoriser les notifications
              </ion-button>
              <button class="ob-link" @click="finish">Ignorer pour l'instant</button>
            </div>
          </div>
        </Transition>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/vue'
import { headsetOutline, bluetoothOutline, notificationsOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { Preferences } from '@capacitor/preferences'
import { useBluetooth } from '@/composables/useBluetooth'
import { useNotifications } from '@/composables/useNotifications'

const TOTAL_STEPS = 3
const ONBOARDING_KEY = 'onboarding_done'

const router = useRouter()
const { initialize } = useBluetooth()
const { requestPermissions } = useNotifications()

const step = ref(1)
const loading = ref(false)
const transitionName = ref('slide-left')

function next() {
  transitionName.value = 'slide-left'
  step.value++
}

async function requestBluetooth() {
  loading.value = true
  try { await initialize() } finally { loading.value = false; next() }
}

async function requestNotifications() {
  loading.value = true
  try { await requestPermissions() } finally { loading.value = false; await finish() }
}

async function finish() {
  await Preferences.set({ key: ONBOARDING_KEY, value: 'true' })
  router.replace('/home')
}
</script>

<style scoped>
.glass-page {
  background: var(--screen-bg);
}

ion-content {
  --background: var(--screen-bg);
}

/* ─── Conteneur principal ────────────────────────────────────────────────── */
.onboarding-wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: calc(env(safe-area-inset-top) + 48px) 24px calc(env(safe-area-inset-bottom) + 32px);
  animation: screen-in 520ms var(--ease-out-soft) both;
}

@keyframes screen-in {
  from { opacity: 0; transform: translateY(10px) scale(0.985); filter: blur(8px); }
  to   { opacity: 1; transform: none;                         filter: blur(0); }
}

/* ─── Dots de progression — reprend la maquette ─────────────────────────── */
.progress-dots {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding-bottom: 32px;
}

.dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.18);
  transition: width 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

/* Dot actif : pilule blanche avec halo */
.dot.active {
  width: 28px;
  background: var(--ink-0);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.45);
  animation: dot-grow 500ms var(--ease-out-pop);
}

/* En thème clair, le dot actif reprend l'accent */
:root[data-theme="light"] .dot.active {
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent-glow);
}

@keyframes dot-grow {
  from { width: 8px; }
  to   { width: 28px; }
}

/* Dot complété */
.dot.done {
  background: rgba(255, 255, 255, 0.6);
}

/* ─── Corps de chaque étape ──────────────────────────────────────────────── */
.ob-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 22px;
  padding: 0 12px;
}

/* ─── Illustration verre ─────────────────────────────────────────────────── */
.ob-illu {
  width: 144px;
  height: 144px;
  border-radius: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow:
    0 30px 60px -20px rgba(80, 60, 220, 0.65),
    0 0 0 8px rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;
  color: var(--ink-0);
}

/* Flottement + légère rotation de l'illustration */
.ob-illu {
  animation: ob-float 5s ease-in-out infinite;
}

@keyframes ob-float {
  0%, 100% { transform: translateY(0)     rotate(0deg); }
  50%      { transform: translateY(-10px) rotate(-1deg); }
}

.ob-illu::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.30), transparent 40%);
  pointer-events: none;
  z-index: 1;
}

/* Halo intérieur pulsant accordé à la teinte de l'étape */
.ob-illu::after {
  content: '';
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 140, 255, 0.55), transparent 65%);
  opacity: 0.6;
  animation: ob-pulse 3.6s ease-in-out infinite;
  pointer-events: none;
}

.ob-illu.welcome::after {
  background: radial-gradient(circle, rgba(180, 120, 255, 0.55), transparent 65%);
}

.ob-illu.bluetooth::after {
  background: radial-gradient(circle, rgba(80, 150, 255, 0.55), transparent 65%);
}

.ob-illu.notifications::after {
  background: radial-gradient(circle, rgba(124, 140, 255, 0.55), transparent 65%);
}

@keyframes ob-pulse {
  0%, 100% { transform: scale(0.85); opacity: 0.35; }
  50%      { transform: scale(1.1);  opacity: 0.70; }
}

/* Variantes de couleur par étape */
.ob-illu.welcome {
  background:
    radial-gradient(120% 120% at 30% 20%, rgba(180, 120, 255, 0.5), transparent 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
}

.ob-illu.bluetooth {
  background:
    radial-gradient(120% 120% at 30% 20%, rgba(80, 150, 255, 0.5), transparent 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
}

.ob-illu.notifications {
  background:
    radial-gradient(120% 120% at 30% 20%, rgba(124, 140, 255, 0.5), transparent 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
}

.ob-icon {
  font-size: 66px;
  position: relative;
  z-index: 2;
}

/* ─── Textes ─────────────────────────────────────────────────────────────── */
.ob-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-0);
}

.ob-text {
  margin: 0;
  font-size: 15px;
  color: var(--ink-2);
  max-width: 300px;
  line-height: 1.5;
}

/* ─── Actions ────────────────────────────────────────────────────────────── */
.ob-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-top: 4px;
}

/* Bouton primaire verre indigo */
.btn-primary {
  --background: linear-gradient(180deg, rgba(124, 140, 255, 0.55), rgba(124, 140, 255, 0.35));
  --background-activated: linear-gradient(180deg, rgba(140, 156, 255, 0.62), rgba(124, 140, 255, 0.42));
  --border-radius: 100px;
  --border-style: solid;
  --border-width: 1px;
  --border-color: rgba(180, 190, 255, 0.45);
  --box-shadow:
    0 10px 30px -10px rgba(124, 140, 255, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  --color: #ffffff;
  --padding-top: 16px;
  --padding-bottom: 16px;
  --ripple-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Lien texte ghost */
.ob-link {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--ink-2);
  font-family: inherit;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
  transition: color 0.2s ease;
}
.ob-link:hover { color: var(--ink-0); }

/* ─── Transitions entre étapes ──────────────────────────────────────────── */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.3s var(--ease-out-soft), transform 0.3s var(--ease-out-soft), filter 0.3s var(--ease-out-soft);
}

.slide-left-enter-from { opacity: 0; transform: translateX(32px);  filter: blur(6px); }
.slide-left-leave-to   { opacity: 0; transform: translateX(-32px); filter: blur(6px); }
</style>
