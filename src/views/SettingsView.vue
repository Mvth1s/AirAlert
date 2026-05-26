<template>
  <ion-page class="glass-page">
    <ion-header class="glass-header" :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home" />
        </ion-buttons>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-list-header>Seuils de notification</ion-list-header>

        <ion-item>
          <ion-label>Avertissement ({{ settings.thresholds.warning }}%)</ion-label>
          <ion-range
            slot="end"
            :min="5"
            :max="50"
            :step="1"
            v-model="settings.thresholds.warning"
            @ion-change="save"
          />
        </ion-item>

        <ion-item>
          <ion-label>Critique ({{ settings.thresholds.critical }}%)</ion-label>
          <ion-range
            slot="end"
            :min="1"
            :max="20"
            :step="1"
            v-model="settings.thresholds.critical"
            @ion-change="save"
          />
        </ion-item>

        <ion-list-header>Notifications</ion-list-header>

        <ion-item>
          <ion-label>Avertissement activé</ion-label>
          <ion-toggle v-model="settings.notifications.warningEnabled" @ion-change="save" />
        </ion-item>

        <ion-item>
          <ion-label>Alerte critique activée</ion-label>
          <ion-toggle v-model="settings.notifications.criticalEnabled" @ion-change="save" />
        </ion-item>
      </ion-list>

      <ion-button expand="block" class="reset-btn" @click="reset">
        Réinitialiser les paramètres
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.glass-page {
  background: var(--screen-bg);
}

ion-content {
  --background: var(--screen-bg);
}

/* Entrée de page */
ion-list,
.reset-btn {
  animation: screen-in 520ms var(--ease-out-soft) both;
}

ion-list { animation-delay: 60ms; }
.reset-btn { animation-delay: 140ms; }

@keyframes screen-in {
  from { opacity: 0; transform: translateY(10px) scale(0.985); filter: blur(8px); }
  to   { opacity: 1; transform: none;                         filter: blur(0); }
}

/* Header transparent + blur */
ion-header {
  --background: transparent;
}

ion-toolbar {
  --background: transparent;
  --border-width: 0;
  --color: var(--ink-0);
  padding-top: env(safe-area-inset-top);
}

ion-back-button {
  --color: var(--ink-1);
}

ion-title {
  --color: var(--ink-0);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ─── Liste verre ────────────────────────────────────────────────────────── */
ion-list {
  --background: transparent;
  background: transparent;
  padding: 0;
  border-radius: 22px;
  overflow: hidden;
}

ion-list-header {
  --background: transparent;
  --color: var(--ink-2);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding-inline-start: 4px;
  padding-top: 24px;
  padding-bottom: 6px;
}

ion-item {
  --background: var(--glass-bg);
  --background-activated: var(--glass-bg-strong);
  --border-color: var(--glass-border-soft);
  --color: var(--ink-0);
  --inner-border-width: 0 0 1px 0;
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 56px;
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
}

ion-item:first-of-type {
  border-radius: 22px 22px 0 0;
}

ion-item:last-of-type {
  border-radius: 0 0 22px 22px;
  --inner-border-width: 0;
}

ion-label {
  --color: var(--ink-1);
  font-size: 15px;
  font-weight: 500;
}

/* Range accent indigo */
ion-range {
  --bar-background: rgba(255, 255, 255, 0.14);
  --bar-background-active: var(--accent);
  --knob-background: var(--ink-0);
  --pin-background: var(--accent);
  --pin-color: var(--ink-0);
  max-width: 160px;
}

/* Toggle accent indigo */
ion-toggle {
  --track-background: rgba(255, 255, 255, 0.14);
  --track-background-checked: var(--accent);
  --handle-background: var(--ink-0);
  --handle-background-checked: var(--ink-0);
}

/* ─── Bouton réinitialiser ───────────────────────────────────────────────── */
.reset-btn {
  --background: transparent;
  --background-activated: rgba(255, 59, 48, 0.12);
  --border-radius: 100px;
  --border-style: solid;
  --border-width: 1px;
  --border-color: rgba(255, 59, 48, 0.45);
  --color: #FF3B30;
  --box-shadow: none;
  --padding-top: 14px;
  --padding-bottom: 14px;
  margin-top: 28px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonRange,
  IonToggle,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings.store'

const store = useSettingsStore()
const { settings } = storeToRefs(store)
const save = () => store.save()
const reset = () => store.reset()
</script>
