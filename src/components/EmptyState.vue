<template>
  <div class="empty-state ion-text-center ion-padding">
    <ion-icon :icon="headsetOutline" class="empty-icon" />
    <h2>Aucun AirPods détecté</h2>
    <p>Assurez-vous que vos AirPods sont connectés à votre iPhone, puis lancez la recherche.</p>
    <ion-button @click="emit('scan')">Rechercher</ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue'
import { headsetOutline } from 'ionicons/icons'

const emit = defineEmits<{ scan: [] }>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 48px;
}

.empty-icon {
  font-size: 64px;
  color: var(--ion-color-medium);
}
</style>
