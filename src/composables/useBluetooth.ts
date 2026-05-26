import { BleClient } from '@capacitor-community/bluetooth-le'
import type { BleService } from '@capacitor-community/bluetooth-le'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { useAirPodsStore } from '@/stores/airpods.store'
import type { AirPodsBattery } from '@/types/airpods.types'

// UUIDs en format 128-bit (requis par le plugin v8)
const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb'
const BATTERY_CHARACTERISTIC = '00002a19-0000-1000-8000-00805f9b34fb'

const POLL_INTERVAL_MS = 60_000
const RECONNECT_DELAY_MS = 3_000
const MAX_RECONNECT_ATTEMPTS = 5
const LAST_DEVICE_KEY = 'ble_last_device'

// État singleton (BLE = une seule connexion active à la fois)
let pollTimer: ReturnType<typeof setInterval> | null = null
let intentionalDisconnect = false

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function readLevel(deviceId: string, serviceUuid: string): Promise<number | null> {
  try {
    const data = await BleClient.read(deviceId, serviceUuid, BATTERY_CHARACTERISTIC)
    return data.getUint8(0)
  } catch {
    return null
  }
}

/**
 * Découvre les instances du Battery Service et lit les niveaux gauche/droite.
 * Certains AirPods exposent deux instances distinctes, d'autres une seule valeur agrégée.
 */
async function discoverBatteries(deviceId: string): Promise<AirPodsBattery> {
  try {
    const services = await BleClient.getServices(deviceId)
    const battSvcs = services.filter((s) => s.uuid.toLowerCase() === BATTERY_SERVICE)

    if (battSvcs.length >= 2) {
      const [left, right] = await Promise.all([
        readLevel(deviceId, battSvcs[0].uuid),
        readLevel(deviceId, battSvcs[1].uuid),
      ])
      return { left, right }
    }

    if (battSvcs.length === 1) {
      const level = await readLevel(deviceId, battSvcs[0].uuid)
      return { left: level, right: level }
    }
  } catch {
    // Échec de la découverte — renvoyer null pour les deux
  }

  return { left: null, right: null }
}

/**
 * Subscribe aux notifications BLE sur toutes les instances du Battery Service qui le supportent.
 * Permet les mises à jour en arrière-plan sans polling (si l'AirPods le supporte).
 */
async function subscribeNotifications(
  deviceId: string,
  services: BleService[],
  onUpdate: (battery: AirPodsBattery) => void,
): Promise<void> {
  const battSvcs = services.filter((s) => s.uuid.toLowerCase() === BATTERY_SERVICE)

  for (const svc of battSvcs) {
    const char = svc.characteristics.find(
      (c) => c.uuid.toLowerCase() === BATTERY_CHARACTERISTIC && c.properties.notify,
    )
    if (!char) continue

    await BleClient.startNotifications(
      deviceId,
      svc.uuid,
      BATTERY_CHARACTERISTIC,
      // Re-lit toutes les batteries à chaque notification pour garder left/right cohérents
      async () => onUpdate(await discoverBatteries(deviceId)),
    )
  }
}

export function useBluetooth() {
  const store = useAirPodsStore()

  /**
   * À appeler au montage de HomeView. Sur iOS, déclenche la demande de permission Bluetooth.
   * Tente aussi de se reconnecter silencieusement au dernier appareil connu.
   */
  async function initialize() {
    if (!Capacitor.isNativePlatform()) return

    await BleClient.initialize()

    const { value } = await Preferences.get({ key: LAST_DEVICE_KEY })
    if (value) {
      const { deviceId, name } = JSON.parse(value) as { deviceId: string; name: string }
      // Reconnexion en arrière-plan, sans bloquer l'UI
      void reconnectLoop(deviceId, name)
    }
  }

  /**
   * Lance le sélecteur natif filtré sur "AirPods" puis se connecte à l'appareil choisi.
   */
  async function scan() {
    if (!Capacitor.isNativePlatform()) return

    store.setStatus('scanning')
    try {
      const device = await BleClient.requestDevice({
        namePrefix: 'AirPods',
        // optionalServices déclare l'intérêt pour le service même s'il n'est pas annoncé
        optionalServices: [BATTERY_SERVICE],
      })
      await connect(device.deviceId, device.name ?? 'AirPods')
    } catch {
      // L'utilisateur a annulé ou aucun appareil trouvé
      store.setStatus('disconnected')
    }
  }

  async function connect(deviceId: string, name: string) {
    store.setStatus('connecting')
    intentionalDisconnect = false

    await BleClient.connect(deviceId, (id) => {
      // Déconnexion inattendue (hors plage, batterie iPhone faible, etc.)
      stopPolling()
      store.reset()
      if (!intentionalDisconnect) void reconnectLoop(id, name)
    })

    // Persistance pour reconnexion au prochain lancement de l'app
    await Preferences.set({
      key: LAST_DEVICE_KEY,
      value: JSON.stringify({ deviceId, name }),
    })

    const services = await BleClient.getServices(deviceId)
    const battery = await discoverBatteries(deviceId)

    store.setDevice({ id: deviceId, name, connected: true, battery, lastUpdated: new Date() })
    store.setStatus('connected')

    const onBatteryUpdate = (battery: AirPodsBattery) => {
      if (store.device) store.setDevice({ ...store.device, battery, lastUpdated: new Date() })
    }

    // Notifications BLE pour les mises à jour en arrière-plan (silencieux si non supporté)
    try {
      await subscribeNotifications(deviceId, services, onBatteryUpdate)
    } catch {
      // Les AirPods ne supportent pas les notifications sur cette génération — polling uniquement
    }

    // Polling toujours actif en complément, même si les notifications fonctionnent
    stopPolling()
    pollTimer = setInterval(async () => onBatteryUpdate(await discoverBatteries(deviceId)), POLL_INTERVAL_MS)
  }

  /**
   * Boucle de reconnexion avec backoff linéaire (3s, 6s, 9s…).
   * S'arrête dès qu'une connexion réussit, que le max est atteint,
   * ou que l'utilisateur déconnecte intentionnellement.
   */
  async function reconnectLoop(deviceId: string, name: string) {
    for (let attempt = 1; attempt <= MAX_RECONNECT_ATTEMPTS; attempt++) {
      if (intentionalDisconnect) return

      store.setStatus('connecting')
      await new Promise((r) => setTimeout(r, RECONNECT_DELAY_MS * attempt))

      if (intentionalDisconnect) return

      try {
        await connect(deviceId, name)
        return // Succès
      } catch {
        // Prochaine tentative
      }
    }

    store.setStatus('error')
  }

  /**
   * Déconnexion volontaire : arrête le polling, efface l'appareil persisté,
   * et empêche toute tentative de reconnexion automatique.
   */
  async function disconnect(deviceId: string) {
    intentionalDisconnect = true
    stopPolling()
    try {
      await BleClient.disconnect(deviceId)
    } catch {
      // Déjà déconnecté — ignoré
    }
    await Preferences.remove({ key: LAST_DEVICE_KEY })
    store.reset()
  }

  return { initialize, scan, disconnect }
}
