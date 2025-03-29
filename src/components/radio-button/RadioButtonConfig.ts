import type { ButtonType } from '@/components/button/ButtonConfig'
import { type ComponentColor, componentColors } from '@/shared/values/colors'
import { toCamelCase } from '@teranes/utils'
import styles from './RadioButton.module.css'

export type RadioButtonProps<V> = {
  label: string
  modelValue?: boolean
  value?: V
  color?: ComponentColor
  disabled?: boolean
  size?: RadioButtonSize
  type?: ButtonType
}

export type RadioButtonEmits = {
  'update:modelValue': [value: boolean]
}

export type RadioButtonSize = 'sm' | 'lg'

export const radioButtonSizeClasses: Record<RadioButtonSize, string> = {
  sm: styles.sm,
  lg: styles.lg,
}

export const radioColorStyles: Partial<Record<ComponentColor, string>> = {}

for (const color of Object.keys(componentColors)) {
  Object.defineProperty(radioColorStyles, color, {
    get() {
      const key = toCamelCase(`radio ${color}`) as keyof typeof styles
      return styles[key] as string
    },
  })
}
