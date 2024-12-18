import type { IconValue } from '@/shared/components/icon'
import styles from './Button.module.css'

export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'lg'

export type ButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'gray'

export type ButtonType = 'fill' | 'outline' | 'text' | 'icon'

export type ButtonPressOptions = {
  stopLoading: () => void
}

export type ButtonProps = {
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
  onPress?: (options: ButtonPressOptions) => void
}

export type ButtonEmits = {
  'update:loading': [value: boolean]
}

export const ButtonSizeClasses: Record<ButtonSize, string> = {
  xxs: styles.btnXxs,
  xs: styles.btnXs,
  sm: styles.btnSm,
  lg: styles.btnLg,
}

export const ButtonColorClasses: Record<ButtonColor, Record<ButtonType, string>> = {
  default: {
    fill: styles.btnPrimary,
    outline: styles.btnPrimaryOutline,
    text: styles.btnPrimaryText,
    icon: styles.btnPrimaryIcon,
  },
  primary: {
    fill: styles.btnPrimary,
    outline: styles.btnPrimaryOutline,
    text: styles.btnPrimaryText,
    icon: styles.btnPrimaryIcon,
  },
  secondary: {
    fill: styles.btnSecondary,
    outline: styles.btnSecondaryOutline,
    text: styles.btnSecondaryText,
    icon: styles.btnSecondaryIcon,
  },
  success: {
    fill: styles.btnSuccess,
    outline: styles.btnSuccessOutline,
    text: styles.btnSuccessText,
    icon: styles.btnSuccessIcon,
  },
  info: {
    fill: styles.btnInfo,
    outline: styles.btnInfoOutline,
    text: styles.btnInfoText,
    icon: styles.btnInfoIcon,
  },
  warning: {
    fill: styles.btnWarning,
    outline: styles.btnWarningOutline,
    text: styles.btnWarningText,
    icon: styles.btnWarningIcon,
  },
  danger: {
    fill: styles.btnDanger,
    outline: styles.btnDangerOutline,
    text: styles.btnDangerText,
    icon: styles.btnDangerIcon,
  },
  gray: {
    fill: styles.btnGray,
    outline: styles.btnGrayOutline,
    text: styles.btnGrayText,
    icon: styles.btnGrayIcon,
  },
}
