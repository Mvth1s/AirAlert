import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AirPodsDevice, ConnectionStatus } from '@/types/airpods.types'

export const useAirPodsStore = defineStore('airpods', () => {
  const device = ref<AirPodsDevice | null>(null)
  const status = ref<ConnectionStatus>('disconnected')

  function setDevice(d: AirPodsDevice) {
    device.value = d
  }

  function setStatus(s: ConnectionStatus) {
    status.value = s
  }

  function reset() {
    device.value = null
    status.value = 'disconnected'
  }

  return { device, status, setDevice, setStatus, reset }
})
