import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import styles from './TextField.module.css'

export type TextFieldProps = TextFieldCommonProps<string> & {
  modelValue?: string
  tags?: string[]
  rows?: number | string
  formatter?: (value: string) => string
  addTagOnEnter?: boolean
}

export type TextFieldEmits = {
  'update:modelValue': [value: string]
  'update:tags': [value: string[]]
}

export type TextFieldSize = 'sm' | 'lg'

export type TextFieldColor = 'success' | 'info' | 'warning' | 'danger'

export type TextFieldCommonProps<T> = ValidationProps<T> & {
  label?: string
  placeholder?: string
  helperText?: string
  size?: TextFieldSize
  color?: TextFieldColor
  message?: string
  disabled?: boolean
  tag?: string
  required?: boolean
}

export function extractTextFieldProps<V>({ label, placeholder, helperText, size, color, message, disabled, tag, required, rules }: TextFieldCommonProps<V> = {}): Omit<TextFieldCommonProps<V>, 'rules'> {
  return { label, placeholder, helperText, size, color, message, disabled, tag, required, rules } as any
}

export const TextFieldsSizesClasses: Record<TextFieldSize, string> = {
  sm: styles.sm,
  lg: styles.lg,
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
