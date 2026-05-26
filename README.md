# 🔔 AirAlert

> Receive notifications when your AirPods battery is running low.

AirAlert is an open-source iOS application built with **Vue 3 + Capacitor** that monitors your AirPods battery level via Bluetooth Low Energy and sends you local notifications before you run out of power.

---

## Features

- 🎧 Detects connected AirPods via BLE (Bluetooth Low Energy)
- 🔋 Displays real-time battery level for left and right earbuds
- 🔔 Sends a notification when battery reaches **≤ 15%**
- 🚨 Sends an urgent notification when battery reaches **≤ 5%**
- ⚙️ Customizable notification thresholds
- 🔒 No account required — fully local, no data sent anywhere
- 📡 Works in background (while app is backgrounded)

---

## Known Limitations

> **Important**: Due to Apple's public API restrictions, AirAlert can only access the battery level of the **earbuds** (left & right) via the standard BLE Battery Service (UUID `0x180F`). The **charging case battery** is managed by a proprietary Apple protocol (AAP) and is **not accessible** to third-party apps without violating Apple's guidelines.

- Battery case level: ❌ Not accessible via public APIs
- Compatibility depends on AirPods generation and iOS version
- Background BLE monitoring is subject to iOS system restrictions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) + TypeScript |
| Mobile Runtime | [Capacitor](https://capacitorjs.com/) |
| UI Components | [Ionic Vue](https://ionicframework.com/docs/vue/overview) |
| Bluetooth | [@capacitor-community/bluetooth-le](https://github.com/capacitor-community/bluetooth-le) |
| Notifications | [@capacitor/local-notifications](https://capacitorjs.com/docs/apis/local-notifications) |
| Build Tool | Vite |
| iOS Build | GitHub Actions (macOS runner) |

---

## Installation (no Apple Developer account required)

AirAlert is distributed as a free sideloadable IPA — no App Store, no $99/year account needed.

### Via AltStore (recommended)
1. Install [AltStore](https://altstore.io) on your iPhone
2. Download the latest `AirAlert.ipa` from [Releases](https://github.com/Mvth1s/AirAlert/releases/latest)
3. AltStore → My Apps → **+** → select the IPA
4. Apps signed with a free Apple ID expire after **7 days** — open AltStore to re-sign

**Or add the AltStore source directly** (auto-updates):
```
https://raw.githubusercontent.com/Mvth1s/AirAlert/main/altstore-source.json
```

### Via Sideloadly (Windows / Mac)
1. Install [Sideloadly](https://sideloadly.io)
2. Connect your iPhone, drag-and-drop the IPA, enter your Apple ID

### Via TrollStore
Check [TrollStore](https://github.com/opa334/TrollStore) for iOS version compatibility — no 7-day expiry.

---

## Prerequisites (for development)

- Node.js >= 22
- pnpm
- Xcode (macOS only) **or** GitHub Actions pipeline

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/airalert.git
cd airalert

# Install dependencies
pnpm install

# Run in browser (limited BLE support)
pnpm dev

# Build web assets
pnpm build

# Sync with Capacitor
npx cap sync ios
```

---

## Building

### Option A — macOS local build
```bash
npx cap open ios
# Then build & run from Xcode
```

### Option B — GitHub Actions (no Mac required)
The repository includes a CI/CD pipeline (`.github/workflows/build-ios.yml`) that automatically builds and publishes an unsigned IPA to [GitHub Releases](https://github.com/Mvth1s/AirAlert/releases/latest) on every push to `main`. No Apple Developer account required.

---

## Project Structure

```
airalert/
├── src/
│   ├── components/         # Vue components
│   ├── composables/        # BLE & notification logic
│   ├── views/              # App screens
│   ├── stores/             # Pinia state management
│   └── App.vue
├── ios/                    # Capacitor iOS project
├── .github/workflows/      # CI/CD pipelines
├── docs/                   # Project documentation
│   ├── ARCHITECTURE.md
│   ├── CAHIER_DES_CHARGES.md
│   ├── USER_STORIES.md
│   ├── CONTRIBUTING.md
│   ├── PRIVACY.md
│   └── CICD.md
└── capacitor.config.ts
```

---

## Privacy

AirAlert collects **no personal data**. All Bluetooth data is processed locally on your device. No analytics, no telemetry, no server.

See [PRIVACY.md](./docs/PRIVACY.md) for the full privacy policy.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) before submitting a pull request.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.
