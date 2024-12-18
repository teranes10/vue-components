import type { IconValue } from '@/shared/components/icon'
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
} from 'lucide'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'warning' | 'info' | 'danger'

export type ToastProps = {
  text: string
  type?: ToastType
  close?: () => void
}

export const ToastIcons: Record<ToastType, IconValue> = {
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
  danger: XCircle,
}

export const ToastColorClasses: Record<ToastType, string> = {
  success: styles.toastSuccess,
  info: styles.toastInfo,
  warning: styles.toastWarning,
  danger: styles.toastDanger,
}
