import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import type { ComponentColor } from '@/shared/values/colors'
import { componentColors } from '@/shared/values/colors'
import { toCamelCase } from '@teranes/utils'
import styles from './Checkbox.module.css'

export type CheckboxIcon = 'tick' | 'minus' | 'square'

export type CheckboxProps<V> = ValidationProps<boolean> & {
  label?: string
  modelValue?: boolean
  value?: V
  icon?: CheckboxIcon
  size?: CheckboxSize
  color?: ComponentColor
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

export const checkboxColorStyles: Partial<Record<ComponentColor, string>> = {}

for (const color of Object.keys(componentColors)) {
  Object.defineProperty(checkboxColorStyles, color, {
    get() {
      const key = toCamelCase(`checkbox ${color}`) as keyof typeof styles
      return styles[key] as string
    },
  })
}
