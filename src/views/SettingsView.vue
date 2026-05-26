<template>
  <ion-page>
    <ion-header>
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

      <ion-button expand="block" fill="outline" class="ion-margin-top" @click="reset">
        Réinitialiser les paramètres
      </ion-button>
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
