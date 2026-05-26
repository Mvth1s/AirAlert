export interface AirPodsBattery {
  left: number | null
  right: number | null
}

export interface AirPodsDevice {
  id: string
  name: string
  connected: boolean
  battery: AirPodsBattery
  lastUpdated: Date | null
}

export type ConnectionStatus =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'error'

export interface NotificationThresholds {
  warning: number
  critical: number
}

export interface AppSettings {
  thresholds: NotificationThresholds
  notifications: {
    warningEnabled: boolean
    criticalEnabled: boolean
  }
}
