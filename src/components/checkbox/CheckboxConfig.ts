import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import styles from './Checkbox.module.css'

export type CheckboxProps<V> = ValidationProps<boolean> & {
  label?: string
  modelValue?: boolean
  value?: V
  icon?: 'tick' | 'minus' | 'square'
  size?: CheckboxSize
  color?: string
  disabled?: boolean
  onChecked?: (value: boolean) => void
}

export type CheckboxEmits = {
  'update:modelValue': [value: boolean]
}

export type CheckboxSize = 'sm' | 'lg'

export const CheckboxSizeClasses: Record<CheckboxSize, string> = {
  sm: styles.sm,
  lg: styles.lg,
}
