<template>
  <ion-page>
    <ion-content class="ion-padding ion-text-center">
      <div class="onboarding-content">
        <ion-icon :icon="headsetOutline" class="onboarding-icon" />
        <h1>Bienvenue sur AirAlert</h1>
        <p>
          AirAlert surveille la batterie de vos AirPods et vous prévient avant qu'ils ne se
          déchargent.
        </p>
        <p class="permissions-info">
          Pour fonctionner, l'application a besoin d'accéder au Bluetooth et aux notifications.
        </p>
        <ion-button expand="block" @click="requestPermissions">
          Autoriser les permissions
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue'
import { headsetOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { requestPermissions: reqNotifPerms } = useNotifications()

async function requestPermissions() {
  await reqNotifPerms()
  router.replace('/home')
}
</script>

<style scoped>
.onboarding-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.onboarding-icon {
  font-size: 80px;
}

.permissions-info {
  color: var(--ion-color-medium);
  font-size: 0.9em;
}
</style>
