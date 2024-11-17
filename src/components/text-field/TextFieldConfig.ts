import type { ValidationProps } from '@/functions/validation/ValidationConfig'

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

export type TextFieldEmits = {
  'update:modelValue': [value: string]
}

export type TextFieldSize = 'sm' | 'lg'
export type TextFieldColor = 'success' | 'info' | 'warning' | 'danger'

export const TextFieldsSizesClasses: Record<TextFieldSize, string> = {
  sm: 'text-field-sm',
  lg: 'text-field-lg',
}

export const TextFieldBorderClasses: Record<TextFieldColor, string> = {
  success: '!border-success',
  info: '!border-info',
  warning: '!border-warning',
  danger: '!border-danger',
}

export const TextFieldMessageClasses: Record<TextFieldColor, string> = {
  success: '!text-success',
  info: '!text-info',
  warning: '!text-warning',
  danger: '!text-danger',
}
