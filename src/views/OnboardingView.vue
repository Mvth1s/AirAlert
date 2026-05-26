<template>
  <ion-page>
    <ion-content class="onboarding-content">
      <div class="onboarding-wrap">
        <!-- Indicateur de progression -->
        <div class="progress-dots">
          <span
            v-for="i in TOTAL_STEPS"
            :key="i"
            class="dot"
            :class="{ active: step === i }"
          />
        </div>

        <!-- Étapes -->
        <Transition :name="transitionName" mode="out-in">
          <!-- Étape 1 : Bienvenue -->
          <div v-if="step === 1" key="1" class="step">
            <div class="step-icon-wrap primary">
              <ion-icon :icon="headsetOutline" class="step-icon" />
            </div>
            <h1>AirAlert</h1>
            <p>Recevez des alertes avant que vos AirPods ne se déchargent complètement.</p>
            <ion-button expand="block" @click="next">Commencer</ion-button>
          </div>

          <!-- Étape 2 : Bluetooth -->
          <div v-else-if="step === 2" key="2" class="step">
            <div class="step-icon-wrap">
              <ion-icon :icon="bluetoothOutline" class="step-icon" />
            </div>
            <h2>Bluetooth</h2>
            <p>
              AirAlert lit la batterie de vos AirPods via Bluetooth Low Energy. Aucune donnée
              n'est envoyée à l'extérieur.
            </p>
            <ion-button expand="block" :disabled="loading" @click="requestBluetooth">
              <ion-spinner v-if="loading" slot="start" name="crescent" />
              Autoriser le Bluetooth
            </ion-button>
          </div>

          <!-- Étape 3 : Notifications -->
          <div v-else-if="step === 3" key="3" class="step">
            <div class="step-icon-wrap success">
              <ion-icon :icon="notificationsOutline" class="step-icon" />
            </div>
            <h2>Notifications</h2>
            <p>
              Recevez une alerte au bon moment, même quand l'application est en arrière-plan.
            </p>
            <ion-button expand="block" :disabled="loading" @click="requestNotifications">
              <ion-spinner v-if="loading" slot="start" name="crescent" />
              Autoriser les notifications
            </ion-button>
            <ion-button expand="block" fill="clear" @click="finish">
              Ignorer pour l'instant
            </ion-button>
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
  try {
    await initialize()
  } finally {
    loading.value = false
    next()
  }
}

async function requestNotifications() {
  loading.value = true
  try {
    await requestPermissions()
  } finally {
    loading.value = false
    await finish()
  }
}

async function finish() {
  await Preferences.set({ key: ONBOARDING_KEY, value: 'true' })
  router.replace('/home')
}
</script>

<style scoped>
.onboarding-content {
  --background: var(--ion-background-color);
}

.onboarding-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  padding: 48px 32px 40px;
}

.progress-dots {
  display: flex;
  gap: 8px;
  margin-bottom: 48px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ion-color-light-shade);
  transition: background 0.3s ease;
}

.dot.active {
  background: var(--ion-color-primary);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  width: 100%;
}

.step-icon-wrap {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: var(--ion-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.step-icon-wrap.primary {
  background: rgba(var(--ion-color-primary-rgb), 0.12);
}

.step-icon-wrap.success {
  background: rgba(var(--ion-color-success-rgb), 0.12);
}

.step-icon {
  font-size: 56px;
  color: var(--ion-color-primary);
}

.step-icon-wrap.success .step-icon {
  color: var(--ion-color-success);
}

h1,
h2 {
  margin: 0;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

p {
  margin: 0;
  color: var(--ion-color-medium);
  line-height: 1.6;
  font-size: 1rem;
}

/* Transitions entre étapes */
.slide-left-enter-active,
.slide-left-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(32px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}
</style>
