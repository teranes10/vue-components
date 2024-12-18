import type { IconValue } from '@/shared/components/icon'
import type { Component } from 'vue'
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
} from 'lucide'
import styles from './Alert.module.css'

export type AlertType = 'success' | 'warning' | 'info' | 'danger'

export type AlertButton = {
  text?: string
  icon?: IconValue
  class?: string
  onClick?: () => void
}

export type AlertProps = {
  title?: string
  text?: string | Component
  icon?: IconValue
  type?: AlertType
  closeButton?: AlertButton
  confirmButton?: AlertButton
}

export const AlertIcons: Record<AlertType, IconValue> = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
  danger: XCircle,
}

export const AlertColorClasses: Record<AlertType, string> = {
  success: styles.alertSuccess,
  info: styles.alertInfo,
  warning: styles.alertWarning,
  danger: styles.alertDanger,
}
