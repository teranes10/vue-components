import type { IconValue } from '@/shared/components/icon'
import styles from './Button.module.css'

export type ButtonSize = 'xs' | 'sm' | 'lg'

export type ButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'gray'

export type ButtonType = 'fill' | 'outline' | 'text'

export interface ButtonClickOptions {
  stopLoading: () => void
}

export interface ButtonProps {
  type?: ButtonType
  color?: ButtonColor
  size?: ButtonSize
  block?: boolean
  loading?: boolean
  loadingText?: string
  isLoading?: boolean
  icon?: IconValue
  text?: string
  tooltip?: string
}

export interface ButtonEmits {
  'update:loading': [value: boolean]
  'clicked': [options: ButtonClickOptions]
}

export const ButtonSizeClasses: Record<ButtonSize, string> = {
  xs: styles.btnXs,
  sm: styles.btnSm,
  lg: styles.btnLg,
}

export const ButtonColorClasses: Record<ButtonColor, Record<ButtonType, string>> = {
  default: {
    fill: styles.btnPrimary,
    outline: styles.btnPrimaryOutline,
    text: styles.btnPrimaryText,
  },
  primary: {
    fill: styles.btnPrimary,
    outline: styles.btnPrimaryOutline,
    text: styles.btnPrimaryText,
  },
  secondary: {
    fill: styles.btnSecondary,
    outline: styles.btnSecondaryOutline,
    text: styles.btnSecondaryText,
  },
  success: {
    fill: styles.btnSuccess,
    outline: styles.btnSuccessOutline,
    text: styles.btnSuccessText,
  },
  info: {
    fill: styles.btnInfo,
    outline: styles.btnInfoOutline,
    text: styles.btnInfoText,
  },
  warning: {
    fill: styles.btnWarning,
    outline: styles.btnWarningOutline,
    text: styles.btnWarningText,
  },
  danger: {
    fill: styles.btnDanger,
    outline: styles.btnDangerOutline,
    text: styles.btnDangerText,
  },
  gray: {
    fill: styles.btnGray,
    outline: styles.btnGrayOutline,
    text: styles.btnGrayText,
  },
}
