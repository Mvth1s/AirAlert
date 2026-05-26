<template>
  <div class="empty-state">
    <div class="empty-illu">
      <ion-icon :icon="headsetOutline" class="empty-icon" />
    </div>
    <div class="empty-text">
      <h2 class="empty-title">Aucun appareil détecté</h2>
      <p class="empty-body">
        Ouvrez le boîtier de vos AirPods à proximité, ou lancez une recherche manuelle.
      </p>
    </div>
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  padding: 0 20px 40px;
}

/* Sphère verre avec dégradé radial — reprend .empty-illu de la maquette */
.empty-illu {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(255, 255, 255, 0.16), transparent 70%),
    rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 30px 60px -20px rgba(0, 0, 0, 0.5),
    0 0 0 8px rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;
}

/* Voile lumineux supérieur */
.empty-illu::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), transparent 35%);
  mix-blend-mode: overlay;
  pointer-events: none;
}

.empty-icon {
  font-size: 66px;
  color: var(--ink-1);
  position: relative;
  z-index: 1;
}

.empty-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--ink-0);
}

.empty-body {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--ink-2);
  max-width: 280px;
  line-height: 1.45;
}

/* Bouton primaire verre indigo — reprend .btn-primary de la maquette */
.scan-btn {
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
  min-width: 240px;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>
