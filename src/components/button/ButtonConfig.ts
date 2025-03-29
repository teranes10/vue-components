import type { IconValue } from '@/shared/components/icon'
import styles from './Button.module.css'

export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'lg'

export type ButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'gray'

export type ButtonType = 'fill' | 'outline' | 'outline-fill' | 'text' | 'text-fill' | 'icon'

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
  active?: boolean
  width?: string | number
  height?: string | number
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
    'fill': styles.btnPrimary,
    'outline': styles.btnPrimaryOutline,
    'text': styles.btnPrimaryText,
    'icon': styles.btnPrimaryIcon,
    'outline-fill': styles.btnPrimaryOutlineFill,
    'text-fill': styles.btnPrimaryTextFill,
  },
  primary: {
    'fill': styles.btnPrimary,
    'outline': styles.btnPrimaryOutline,
    'text': styles.btnPrimaryText,
    'icon': styles.btnPrimaryIcon,
    'outline-fill': styles.btnPrimaryOutlineFill,
    'text-fill': styles.btnPrimaryTextFill,
  },
  secondary: {
    'fill': styles.btnSecondary,
    'outline': styles.btnSecondaryOutline,
    'text': styles.btnSecondaryText,
    'icon': styles.btnSecondaryIcon,
    'outline-fill': styles.btnSecondaryOutlineFill,
    'text-fill': styles.btnSecondaryTextFill,
  },
  success: {
    'fill': styles.btnSuccess,
    'outline': styles.btnSuccessOutline,
    'text': styles.btnSuccessText,
    'icon': styles.btnSuccessIcon,
    'outline-fill': styles.btnSuccessOutlineFill,
    'text-fill': styles.btnSuccessTextFill,
  },
  info: {
    'fill': styles.btnInfo,
    'outline': styles.btnInfoOutline,
    'text': styles.btnInfoText,
    'icon': styles.btnInfoIcon,
    'outline-fill': styles.btnInfoOutlineFill,
    'text-fill': styles.btnInfoTextFill,
  },
  warning: {
    'fill': styles.btnWarning,
    'outline': styles.btnWarningOutline,
    'text': styles.btnWarningText,
    'icon': styles.btnWarningIcon,
    'outline-fill': styles.btnWarningOutlineFill,
    'text-fill': styles.btnWarningTextFill,
  },
  danger: {
    'fill': styles.btnDanger,
    'outline': styles.btnDangerOutline,
    'text': styles.btnDangerText,
    'icon': styles.btnDangerIcon,
    'outline-fill': styles.btnDangerOutlineFill,
    'text-fill': styles.btnDangerTextFill,
  },
  gray: {
    'fill': styles.btnGray,
    'outline': styles.btnGrayOutline,
    'text': styles.btnGrayText,
    'icon': styles.btnGrayIcon,
    'outline-fill': styles.btnGrayOutlineFill,
    'text-fill': styles.btnGrayTextFill,
  },
}
