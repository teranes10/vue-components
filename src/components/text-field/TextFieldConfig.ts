import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import styles from './TextField.module.css'

export type TextFieldProps = ValidationProps<string> & {
  modelValue?: string
  label?: string
  placeholder?: string
  helperText?: string
  size?: TextFieldSize
  color?: TextFieldColor
  message?: string
  disabled?: boolean
  tag?: string
  rows?: number
  required?: boolean
  formatter?: (value: string) => string
}

export interface TextFieldEmits {
  'update:modelValue': [value: string]
}

export type TextFieldSize = 'sm' | 'lg'
export type TextFieldColor = 'success' | 'info' | 'warning' | 'danger'

export const TextFieldsSizesClasses: Record<TextFieldSize, string> = {
  sm: styles.textFieldSm,
  lg: styles.textFieldLg,
}

export const TextFieldBorderClasses: Record<TextFieldColor, string> = {
  success: styles.success,
  info: styles.info,
  warning: styles.warning,
  danger: styles.error,
}

export const TextFieldMessageClasses: Record<TextFieldColor, string> = {
  success: styles.messageSuccess,
  info: styles.messageInfo,
  warning: styles.messageWarning,
  danger: styles.messageError,
}
