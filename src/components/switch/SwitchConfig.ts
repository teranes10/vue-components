import { type ComponentColor, componentColors } from '@/shared/values/colors'
import { toCamelCase } from '@teranes/utils'
import styles from './Switch.module.css'

export type SwitchProps = {
  label?: string
  modelValue?: boolean
  disabled?: boolean
  color?: ComponentColor
  onChange?: (value: boolean) => void
}

export type SwitchEmits = {
  'update:modelValue': [value: boolean]
}

export const switchColorStyles: Partial<Record<ComponentColor, string>> = {}

for (const color of Object.keys(componentColors)) {
  Object.defineProperty(switchColorStyles, color, {
    get() {
      const key = toCamelCase(`switch ${color}`) as keyof typeof styles
      return styles[key] as string
    },
  })
}
