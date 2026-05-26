# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

AirAlert is an iOS-only app built with **Vue 3 + Capacitor 8** that monitors AirPods battery levels via Bluetooth Low Energy (BLE) and sends local notifications before the earbuds run out of power.

## Commands

```bash
pnpm install         # Install dependencies
pnpm dev             # Run in browser (BLE unavailable, UI only)
pnpm build           # Build web assets (required before cap sync)
pnpm lint            # Lint check
pnpm lint:fix        # Auto-fix lint issues
pnpm type-check      # Type check without building
npx cap sync ios     # Sync web assets to Capacitor iOS project
npx cap open ios     # Open Xcode
```

> BLE and notifications require a physical iPhone. The browser dev mode is only for UI work.

## Architecture

### Core composables (`src/composables/`)

The business logic lives entirely in three composables:

- **`useBluetooth.ts`** — BLE scan, connect to AirPods, read Battery Service (UUID `0x180F`, characteristic `0x2A19`). Polls every 60 s in foreground; subscribes to BLE notifications for background updates.
- **`useNotifications.ts`** — Wrapper around `@capacitor/local-notifications`. Sends warning (level 1) and critical (level 2) alerts.
- **`useBatteryMonitor.ts`** — Orchestrates the other two. Watches the Pinia store for battery changes and fires notifications based on thresholds. Tracks `alreadyNotified.warning` and `alreadyNotified.critical` flags per charge session to prevent duplicate alerts; resets a flag when battery rises back above its threshold.
- **`useTheme.ts`** — Singleton composable managing dark/light theme. Sets `data-theme` attribute on `<html>` and toggles `ion-palette-dark` class for Ionic. Persists preference in `localStorage`; falls back to `prefers-color-scheme` on first launch. Import it in `main.ts` to initialize before Vue mounts.

### Pinia stores (`src/stores/`)

- **`airpods.store.ts`** — Live AirPods state: `id`, `name`, `connected`, `battery: { left, right }`, `lastUpdated`.
- **`settings.store.ts`** — User preferences persisted via `@capacitor/preferences`: warning threshold (default 15%), critical threshold (default 5%), and per-level notification toggles.

### Views and routing

Three screens via Vue Router: `HomeView` (battery display), `SettingsView` (threshold configuration), `OnboardingView` (Bluetooth + Notification permission requests on first launch).

### Key types (`src/types/airpods.types.ts`)

```typescript
AirPodsBattery        // { left: number | null, right: number | null }
AirPodsDevice         // id, name, connected, battery, lastUpdated
ConnectionStatus      // 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'error'
NotificationThresholds // { warning: number, critical: number }
AppSettings           // thresholds + notifications toggles
```

## iOS-specific constraints

### Background BLE
iOS only allows BLE in the background for **already-connected** peripherals. The app must:
1. Establish the AirPods connection in the foreground.
2. Maintain it using the `bluetooth-central` background mode (`Info.plist`).
3. Subscribe to BLE characteristic notifications if the AirPods support them; otherwise updates are foreground-only.

The case battery is inaccessible — Apple's AAP protocol is private and must not be used.

### Required `Info.plist` entries
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>AirAlert utilise le Bluetooth pour lire le niveau de batterie de vos AirPods.</string>
<key>UIBackgroundModes</key>
<array>
    <string>bluetooth-central</string>
</array>
```

### Minimum target: iOS 15.0, iPhone only.

## Code style

- **Vue 3 Composition API only** — always use `<script setup>`, never Options API.
- **TypeScript strict mode** — avoid `any`.
- **Prettier** for formatting (config in `.prettierrc`), **ESLint** with Vue + TypeScript rules.
- Run `pnpm lint` before committing.

## Commit convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Example: `feat(ble): add automatic reconnection on connection loss`

## Out of scope (v1)

- AirPods case battery (private Apple API)
- Android support
- Cloud sync or user accounts
- Any third-party analytics or crash reporting SDK
