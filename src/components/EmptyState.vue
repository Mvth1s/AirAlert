<template>
  <div class="empty-state">
    <div class="empty-icon-wrap">
      <ion-icon :icon="headsetOutline" class="empty-icon" />
    </div>
    <h2 class="empty-title">Aucun AirPods détecté</h2>
    <p class="empty-body">
      Assurez-vous que vos AirPods sont connectés à votre iPhone, puis lancez la recherche.
    </p>
    <ion-button expand="block" class="scan-btn" @click="emit('scan')">
      <ion-icon slot="start" :icon="searchOutline" />
      Rechercher mes AirPods
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue'
import { headsetOutline, searchOutline } from 'ionicons/icons'

const emit = defineEmits<{ scan: [] }>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px 32px;
  gap: 16px;
}

.empty-icon-wrap {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--ion-color-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 52px;
  color: var(--ion-color-medium);
}

.empty-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-body {
  margin: 0;
  color: var(--ion-color-medium);
  line-height: 1.5;
}

.scan-btn {
  width: 100%;
  margin-top: 8px;
}
</style>
