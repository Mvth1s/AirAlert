import { BleClient } from '@capacitor-community/bluetooth-le'
import { useAirPodsStore } from '@/stores/airpods.store'
import type { AirPodsDevice } from '@/types/airpods.types'

const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb'
const BATTERY_CHARACTERISTIC = '00002a19-0000-1000-8000-00805f9b34fb'

const POLL_INTERVAL_MS = 60_000

let pollTimer: ReturnType<typeof setInterval> | null = null

export function useBluetooth() {
  const store = useAirPodsStore()

  async function initialize() {
    await BleClient.initialize()
  }

  async function scan() {
    store.setStatus('scanning')
    try {
      const device = await BleClient.requestDevice({
        services: [BATTERY_SERVICE],
      })
      await connect(device.deviceId, device.name ?? 'AirPods')
    } catch {
      store.setStatus('disconnected')
    }
  }

  async function connect(deviceId: string, name: string) {
    store.setStatus('connecting')
    try {
      await BleClient.connect(deviceId, () => onDisconnect(deviceId))
      const airpods: AirPodsDevice = {
        id: deviceId,
        name,
        connected: true,
        battery: { left: null, right: null },
        lastUpdated: null,
      }
      store.setDevice(airpods)
      store.setStatus('connected')
      startPolling(deviceId)
    } catch {
      store.setStatus('error')
    }
  }

  async function readBatteryLevel(deviceId: string): Promise<number | null> {
    try {
      const result = await BleClient.read(deviceId, BATTERY_SERVICE, BATTERY_CHARACTERISTIC)
      return result.getUint8(0)
    } catch {
      return null
    }
  }

  function startPolling(deviceId: string) {
    stopPolling()
    pollTimer = setInterval(async () => {
      const level = await readBatteryLevel(deviceId)
      if (level !== null && store.device) {
        store.setDevice({
          ...store.device,
          battery: { left: level, right: level },
          lastUpdated: new Date(),
        })
      }
    }, POLL_INTERVAL_MS)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  async function disconnect(deviceId: string) {
    stopPolling()
    await BleClient.disconnect(deviceId)
    store.reset()
  }

  function onDisconnect(_deviceId: string) {
    stopPolling()
    store.reset()
  }

  return { initialize, scan, disconnect }
}
