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

## Prerequisites

- Node.js >= 18
- npm or pnpm
- Xcode (for iOS build, macOS required) **or** GitHub Actions pipeline (see [Building](#building))
- An Apple Developer account (free for TestFlight, paid for App Store)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/airalert.git
cd airalert

# Install dependencies
npm install

# Run in browser (limited BLE support)
npm run dev

# Build web assets
npm run build

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
The repository includes a CI/CD pipeline (`.github/workflows/build-ios.yml`) that uses a macOS GitHub Actions runner to build the `.ipa` file automatically on each push to `main`.

> Requires setting up your Apple Developer credentials as GitHub Secrets (see [CI/CD documentation](./docs/CICD.md)).

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
│   ├── CAHIER_DES_CHARGES.md
│   ├── USER_STORIES.md
│   └── ARCHITECTURE.md
└── capacitor.config.ts
```

---

## Privacy

AirAlert collects **no personal data**. All Bluetooth data is processed locally on your device. No analytics, no telemetry, no server.

See [PRIVACY.md](./PRIVACY.md) for the full privacy policy (required for App Store submission).

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting a pull request.

---

## License

MIT License — see [LICENSE](./LICENSE) for details.
