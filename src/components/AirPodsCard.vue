<template>
  <ion-card class="airpods-card">
    <ion-card-header>
      <div class="card-header-row">
        <div class="device-illu">
          <ion-icon :icon="headsetOutline" class="device-icon" />
        </div>
        <div class="card-header-text">
          <ion-card-title>{{ device.name }}</ion-card-title>
          <ion-card-subtitle v-if="formattedTime">à proximité · {{ formattedTime }}</ion-card-subtitle>
        </div>
      </div>
    </ion-card-header>

    <ion-card-content>
      <div class="battery-row">
        <BatteryIndicator label="Gauche" :level="device.battery.left" />
        <div class="divider" />
        <BatteryIndicator label="Droite" :level="device.battery.right" />
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon } from '@ionic/vue'
import { headsetOutline } from 'ionicons/icons'
import { computed } from 'vue'
import type { AirPodsDevice } from '@/types/airpods.types'
import BatteryIndicator from './BatteryIndicator.vue'

const props = defineProps<{ device: AirPodsDevice }>()

const formattedTime = computed(() =>
  props.device.lastUpdated
    ? props.device.lastUpdated.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null,
)
</script>

<style scoped>
/* ─── Carte principale — verre translucide ──────────────────────────────── */
.airpods-card {
  margin: 0;
  --background: rgba(255, 255, 255, 0.08);
  --color: var(--ink-1);
  border-radius: 28px;
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04) inset,
    0 20px 40px -20px rgba(0, 0, 0, 0.6),
    0 8px 24px -12px rgba(80, 60, 200, 0.35);
  overflow: hidden;
}

/* Bande spéculaire en haut de la carte */
.airpods-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 12px;
  right: 12px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--glass-highlight), transparent);
  opacity: 0.7;
  pointer-events: none;
  z-index: 2;
}

/* Voile lumineux sur le tiers supérieur */
.airpods-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
  pointer-events: none;
  border-radius: 28px 28px 0 0;
  z-index: 1;
}

/* ─── En-tête ────────────────────────────────────────────────────────────── */
.card-header-row {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 3;
}

/* Icône AirPods dans un carré verre */
.device-illu {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.device-icon {
  font-size: 1.8rem;
  color: var(--ink-0);
}

.card-header-text {
  flex: 1;
}

/* Override couleurs du sous-titre Ionic */
ion-card-title  { color: var(--ink-0) !important; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
ion-card-subtitle { color: var(--ink-3) !important; font-size: 12px; margin-top: 2px; }

/* ─── Jauges ─────────────────────────────────────────────────────────────── */
.battery-row {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding-top: 4px;
  position: relative;
  z-index: 3;
}

/* Masqué — le gap remplace le séparateur */
.divider { display: none; }
</style>
