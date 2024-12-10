import { type ComponentColor, componentColors } from '@/shared/values/colors'
import { toCamelCase } from '@teranes/utils'
import styles from './RadioButton.module.css'

export interface RadioButtonProps<V> {
  label: string
  modelValue?: boolean
  value?: V
  color?: ComponentColor
  disabled?: boolean
}

export interface RadioButtonEmits {
  'update:modelValue': [value: boolean]
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
