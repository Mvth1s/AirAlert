# Privacy Policy — AirAlert

**Last updated:** May 2026  
**Applies to:** AirAlert iOS application

---

## Summary

**AirAlert does not collect, store, or share any personal data.**  
All processing happens locally on your device. No data ever leaves your iPhone.

---

## 1. Data We Do NOT Collect

AirAlert does **not** collect, transmit, or store any of the following:

- Personal information (name, email, phone number, etc.)
- Location data
- Bluetooth device identifiers or MAC addresses outside of your device
- Battery level data (read locally, never sent anywhere)
- Usage analytics or statistics
- Crash reports
- Advertising identifiers (IDFA)
- Any other data

---

## 2. Bluetooth Access

AirAlert requests access to Bluetooth for the **sole purpose** of reading the battery level of your AirPods via the standard BLE Battery Service (UUID `0x180F`).

- Bluetooth data is read **locally on your device only**
- No Bluetooth data is stored, logged, or transmitted
- You can revoke Bluetooth permission at any time in **Settings → Privacy & Security → Bluetooth**

---

## 3. Local Notifications

AirAlert sends **local notifications** triggered entirely on your device. These notifications:

- Are generated locally, with no server or internet connection involved
- Contain only battery level information read from your AirPods
- Are never sent to any external service

You can disable notifications at any time in **Settings → Notifications → AirAlert**.

---

## 4. Local Storage

AirAlert stores your **preferences** (notification thresholds and settings) locally on your device using iOS secure storage (`UserDefaults` via Capacitor Preferences).

- This data never leaves your device
- It is deleted when you uninstall the app

---

## 5. Third-Party Services

AirAlert uses **no third-party SDKs** for analytics, advertising, crash reporting, or any other purpose.

There are no integrations with:
- Google Analytics / Firebase
- Facebook SDK
- Sentry or Crashlytics
- Any advertising network

---

## 6. Children's Privacy

AirAlert does not collect any data from anyone, including children. The app is safe for all ages.

---

## 7. Changes to This Policy

If this privacy policy changes in a future version of AirAlert, the updated policy will be published in this repository and the **Last updated** date will be revised.

Since no data is collected, changes would only occur to reflect new features or legal requirements.

---

## 8. Open Source

AirAlert is fully open source. You can audit every line of code to verify these claims:  
👉 [github.com/Mvth1s/airalert](https://github.com/Mvth1s/airalert)

---

## 9. Contact

If you have any questions about this privacy policy, please open an issue on the GitHub repository:  
👉 [github.com/Mvth1s/airalert/issues](https://github.com/Mvth1s/airalert/issues)
