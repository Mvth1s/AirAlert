import { LocalNotifications } from '@capacitor/local-notifications'

let nextId = 10

export function useNotifications() {
  async function requestPermissions() {
    return LocalNotifications.requestPermissions()
  }

  async function sendWarningNotification(level: number, side: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: nextId++,
          title: 'AirAlert — Batterie faible',
          body: `${side} : ${level}% restant`,
          schedule: { at: new Date() },
        },
      ],
    })
  }

  async function sendCriticalNotification(level: number, side: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: nextId++,
          title: 'AirAlert — Batterie critique',
          body: `${side} : ${level}% — rechargez maintenant`,
          schedule: { at: new Date() },
        },
      ],
    })
  }

  return { requestPermissions, sendWarningNotification, sendCriticalNotification }
}
