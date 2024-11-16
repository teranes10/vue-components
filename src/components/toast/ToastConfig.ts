import {
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  InfoIcon,
} from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'warning' | 'info' | 'danger'

export interface ToastProps {
  text: string
  type?: ToastType
  close?: () => void
}

export const ToastIcons: Record<ToastType, FunctionalComponent> = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: AlertCircleIcon,
  danger: XCircleIcon,
}

export const ToastColorClasses: Record<ToastType, string> = {
  success: styles.toastSuccess,
  info: styles.toastInfo,
  warning: styles.toastWarning,
  danger: styles.toastDanger,
}
