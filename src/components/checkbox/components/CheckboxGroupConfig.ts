import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import type { Ref } from 'vue'
import type { CheckboxProps } from '../CheckboxConfig'

export type CheckboxGroupProps<V> = ValidationProps<V[]> & {
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

export type CheckBoxGroupContext<V> = {
  inline: boolean
  onInitialize: (value: V, checked: Ref<boolean>) => void
  onCheckChanged: (value: V, checked: boolean) => void
}

export const CheckboxGroupContextKey = 'CheckboxGroupContextKey'
