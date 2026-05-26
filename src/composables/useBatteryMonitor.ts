import { watch } from 'vue'
import { useAirPodsStore } from '@/stores/airpods.store'
import { useSettingsStore } from '@/stores/settings.store'
import { useNotifications } from './useNotifications'

type Side = 'left' | 'right'

const SIDE_LABEL: Record<Side, string> = { left: 'Gauche', right: 'Droite' }

export function useBatteryMonitor() {
  const airpodsStore = useAirPodsStore()
  const settingsStore = useSettingsStore()
  const { sendWarningNotification, sendCriticalNotification } = useNotifications()

  const alreadyNotified = {
    warning: { left: false, right: false } as Record<Side, boolean>,
    critical: { left: false, right: false } as Record<Side, boolean>,
  }

  function start() {
    watch(
      () => airpodsStore.device?.battery,
      (battery) => {
        if (!battery) return
        const { warning, critical } = settingsStore.settings.thresholds
        const { warningEnabled, criticalEnabled } = settingsStore.settings.notifications

        for (const side of ['left', 'right'] as Side[]) {
          const level = battery[side]
          if (level === null) continue

          if (criticalEnabled && level <= critical && !alreadyNotified.critical[side]) {
            sendCriticalNotification(level, SIDE_LABEL[side])
            alreadyNotified.critical[side] = true
          } else if (level > critical) {
            alreadyNotified.critical[side] = false
          }

          if (warningEnabled && level <= warning && !alreadyNotified.warning[side]) {
            sendWarningNotification(level, SIDE_LABEL[side])
            alreadyNotified.warning[side] = true
          } else if (level > warning) {
            alreadyNotified.warning[side] = false
          }
        }
      },
      { deep: true },
    )
  }

  return { start }
}
