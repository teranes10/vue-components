import { toCamelCase } from '@teranes/utils'
import { componentColors, type ComponentColor } from '../../assets/values/colors'
import styles from './Switch.module.css'

export interface SwitchProps {
  label?: string
  modelValue?: boolean
  disabled?: boolean
  color?: ComponentColor
}

export type SwitchEmits = {
  'update:modelValue': [value: boolean]
  'changed': [value: boolean]
}

export const switchColorStyles: Partial<Record<ComponentColor, string>> = {}

for (const color of Object.keys(componentColors)) {
  Object.defineProperty(switchColorStyles, color, {
    get: function () {
      const key = toCamelCase(`switch ${color}`) as keyof typeof styles
      return styles[key] as string
    },
  })
}
