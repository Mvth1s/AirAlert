import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Preferences } from '@capacitor/preferences'
import type { AppSettings } from '@/types/airpods.types'

const DEFAULTS: AppSettings = {
  thresholds: { warning: 15, critical: 5 },
  notifications: { warningEnabled: true, criticalEnabled: true },
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>(structuredClone(DEFAULTS))

  async function load() {
    const { value } = await Preferences.get({ key: 'settings' })
    if (value) settings.value = JSON.parse(value)
  }

  async function save() {
    await Preferences.set({ key: 'settings', value: JSON.stringify(settings.value) })
  }

  function reset() {
    settings.value = structuredClone(DEFAULTS)
    save()
  }

  return { settings, load, save, reset }
})
