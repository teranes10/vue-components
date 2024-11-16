import {
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  InfoIcon,
} from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import styles from './Alert.module.css'

export type AlertType = 'success' | 'warning' | 'info' | 'danger'

export interface AlertButton {
  text?: string
  icon?: FunctionalComponent
  class?: string
  onClick?: () => void
}

export interface AlertProps {
  title?: string
  text?: string
  icon?: FunctionalComponent
  type?: AlertType
  closeButton?: AlertButton
  confirmButton?: AlertButton
}

export const AlertIcons: Record<AlertType, FunctionalComponent> = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: AlertCircleIcon,
  danger: XCircleIcon,
}

export const AlertColorClasses: Record<AlertType, string> = {
  success: styles.alertSuccess,
  info: styles.alertInfo,
  warning: styles.alertWarning,
  danger: styles.alertDanger,
}
