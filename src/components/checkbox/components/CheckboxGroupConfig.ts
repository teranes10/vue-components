import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import type { Ref } from 'vue'
import type { CheckboxProps } from '../CheckboxConfig'
import styles from './CheckboxGroup.module.css'

type BaseProps<V> = Pick<CheckboxProps<V>, 'icon' | 'color' | 'size'>

export type CheckboxGroupProps<V> = ValidationProps<V[]> & BaseProps<V> & {
  modelValue?: V[]
  label?: string
  tag?: string
  required?: boolean
  inline?: boolean
  items?: CheckboxProps<V>[]
}

export type CheckboxGroupEmits<V> = {
  'update:modelValue': [values: V[]]
}

export type CheckBoxGroupContext<V> = BaseProps<V> & {
  inline: boolean
  onInitialize: (value: V, checked: Ref<boolean>) => void
  onCheckChanged: (value: V, checked: boolean) => void
}

export const CheckboxGroupContextKey = 'CheckboxGroupContextKey'

export type CheckboxGroupSize = 'sm' | 'lg'

export const CheckboxGroupSizeClasses: Record<CheckboxGroupSize, string> = {
  sm: styles.sm,
  lg: styles.lg,
}
