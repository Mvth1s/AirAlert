# Architecture Technique — AirAlert

**Version** : 1.0  
**Date** : Mai 2026  

---

## 1. Stack technique

| Couche | Technologie | Version cible | Rôle |
|---|---|---|---|
| UI Framework | Vue 3 | 3.x | Interface utilisateur |
| Language | TypeScript | 5.x | Typage statique |
| Mobile Runtime | Capacitor | 8.x | Bridge natif iOS |
| UI Components | Ionic Vue | 8.x | Composants mobiles |
| State Management | Pinia | 2.x | État global de l'app |
| Bluetooth BLE | @capacitor-community/bluetooth-le | latest | Lecture batterie AirPods |
| Notifications | @capacitor/local-notifications | latest | Alertes locales |
| Persistance | @capacitor/preferences | latest | Sauvegarde des paramètres |
| Build Tool | Vite | 5.x | Bundler |
| CI/CD | GitHub Actions | — | Build iOS automatique |

---

## 2. Structure des dossiers

```
airalert/
├── src/
│   ├── components/
│   │   ├── BatteryIndicator.vue      # Jauge batterie (gauche/droite)
│   │   ├── AirPodsCard.vue           # Carte principale AirPods
│   │   ├── ConnectionStatus.vue      # Indicateur d'état BLE
│   │   └── EmptyState.vue            # Écran "aucun AirPods détecté"
│   │
│   ├── composables/
│   │   ├── useBluetooth.ts           # Logique BLE (scan, connexion, lecture)
│   │   ├── useNotifications.ts       # Logique notifications locales
│   │   ├── useBatteryMonitor.ts      # Orchestration monitoring + seuils
│   │   └── useTheme.ts               # Thème clair/sombre (singleton, data-theme)
│   │
│   ├── stores/
│   │   ├── airpods.store.ts          # État AirPods (batterie, connexion)
│   │   └── settings.store.ts         # Paramètres utilisateur (seuils, toggles)
│   │
│   ├── views/
│   │   ├── HomeView.vue              # Écran principal (batterie)
│   │   ├── SettingsView.vue          # Écran paramètres
│   │   └── OnboardingView.vue        # Écran d'onboarding
│   │
│   ├── router/
│   │   └── index.ts                  # Vue Router
│   │
│   ├── types/
│   │   └── airpods.types.ts          # Interfaces TypeScript
│   │
│   ├── App.vue
│   └── main.ts
│
├── ios/
│   └── App/
│       ├── App/
│       │   └── Info.plist            # Permissions Bluetooth + Background modes
│       └── Podfile
│
├── .github/
│   └── workflows/
│       └── build-ios.yml             # Pipeline CI/CD GitHub Actions
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CAHIER_DES_CHARGES.md
│   ├── USER_STORIES.md
│   ├── CONTRIBUTING.md
│   ├── PRIVACY.md
│   └── CICD.md
│
├── capacitor.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Flux de données BLE

```
iPhone (Capacitor App)
│
├── [Foreground]
│   ├── App launch
│   │   └── BLECentralManager.scan()
│   │       └── Identifie AirPods (nom du device)
│   │           └── Connect to peripheral
│   │               └── Discover services (UUID 0x180F)
│   │                   └── Read characteristic (UUID 0x2A19)
│   │                       └── → battery level (0-100)
│   │                           ├── Update Pinia store
│   │                           └── Check thresholds → trigger notification
│   │
│   └── Poll every 60s (setInterval)
│       └── Read characteristic → update store
│
└── [Background]
    ├── iOS autorise BLE background uniquement pour périphériques DÉJÀ connectés
    ├── Background mode : "bluetooth-central" (Info.plist)
    └── Callback on characteristic value change (si AirPods supportent les notifications BLE)
        └── → Check thresholds → trigger local notification
```

---

## 4. Gestion des notifications

```
useBatteryMonitor.ts
│
├── Surveille les changements de batterie (store watcher)
│
├── Seuil avertissement (défaut 15%)
│   ├── Si battery <= threshold && !alreadyNotified.warning
│   │   ├── Send local notification (niveau 1)
│   │   └── Set alreadyNotified.warning = true
│   └── Si battery > threshold
│       └── Reset alreadyNotified.warning = false
│
└── Seuil critique (défaut 5%)
    ├── Si battery <= threshold && !alreadyNotified.critical
    │   ├── Send local notification (niveau 2)
    │   └── Set alreadyNotified.critical = true
    └── Si battery > threshold
        └── Reset alreadyNotified.critical = false
```

---

## 5. Permissions iOS requises (Info.plist)

```xml
<!-- Bluetooth usage description (obligatoire App Store) -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>AirAlert utilise le Bluetooth pour lire le niveau de batterie de vos AirPods.</string>

<!-- Background modes -->
<key>UIBackgroundModes</key>
<array>
    <string>bluetooth-central</string>
</array>
```

---

## 6. Types TypeScript principaux

```typescript
// types/airpods.types.ts

export interface AirPodsBattery {
  left: number | null;   // 0-100 | null si non disponible
  right: number | null;
}

export interface AirPodsDevice {
  id: string;
  name: string;
  connected: boolean;
  battery: AirPodsBattery;
  lastUpdated: Date | null;
}

export type ConnectionStatus =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'error';

export interface NotificationThresholds {
  warning: number;   // défaut : 15
  critical: number;  // défaut : 5
}

export interface AppSettings {
  thresholds: NotificationThresholds;
  notifications: {
    warningEnabled: boolean;
    criticalEnabled: boolean;
  };
}
```

---

## 7. Pipeline CI/CD GitHub Actions

```yaml
# .github/workflows/build-ios.yml

name: Build iOS

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build web assets
        run: pnpm build

      - name: Capacitor sync
        run: npx cap sync ios

      - name: Install CocoaPods
        run: cd ios && pod install

      - name: Build iOS (unsigned)
        run: |
          xcodebuild \
            -workspace ios/App/App.xcworkspace \
            -scheme App \
            -configuration Release \
            -sdk iphoneos \
            CODE_SIGN_IDENTITY="" \
            CODE_SIGNING_REQUIRED=NO \
            -archivePath build/AirAlert.xcarchive \
            archive

      # Pour signer et exporter vers TestFlight :
      # Nécessite les secrets Apple Developer dans GitHub Secrets
      # Voir docs/CICD.md pour la configuration complète
```

---

## 8. Contraintes iOS Background BLE

> ⚠️ Point critique à connaître avant de commencer le développement.

iOS impose des restrictions strictes sur le BLE en arrière-plan :

| Contexte | Comportement |
|---|---|
| App au premier plan | Scan BLE libre, lecture à la demande ✅ |
| App en arrière-plan | Uniquement les périphériques **déjà connectés** ⚠️ |
| App tuée (killed) | Aucun BLE ❌ |

**Stratégie adoptée :**
1. La connexion aux AirPods est établie au premier plan
2. La connexion est maintenue en arrière-plan (`bluetooth-central` background mode)
3. L'app subscribe aux notifications BLE de la caractéristique batterie si supporté
4. En cas de non-support des notifications BLE par les AirPods, la mise à jour n'est possible qu'au premier plan

Cette limitation est documentée dans l'app et dans le README.

---

## 9. Décisions d'architecture

| Décision | Choix | Raison |
|---|---|---|
| State management | Pinia | Léger, natif Vue 3, TypeScript-first |
| Persistance | @capacitor/preferences | Wrapper natif simple, pas de SQLite nécessaire |
| Routing | Vue Router | Standard Vue, Ionic s'intègre nativement |
| Pas de backend | Local only | Respect vie privée, pas de compte utilisateur |
| Pas d'analytics | Aucun SDK tiers | Privacy Nutrition Label "No data collected" |
