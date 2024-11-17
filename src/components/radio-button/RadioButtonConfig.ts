import { toCamelCase } from '@teranes/utils'
import { componentColors, type ComponentColor } from '@/shared/values/colors'
import styles from './RadioButton.module.css'

export interface RadioButtonProps<V> {
  label: string
  modelValue?: boolean
  value?: V
  color?: ComponentColor
  disabled?: boolean
}

export type RadioButtonEmits = {
  'update:modelValue': [value: boolean]
}

export const radioColorStyles: Partial<Record<ComponentColor, string>> = {}

for (const color of Object.keys(componentColors)) {
  Object.defineProperty(radioColorStyles, color, {
    get: function () {
      const key = toCamelCase(`radio ${color}`) as keyof typeof styles
      return styles[key] as string
    },
  })
}
