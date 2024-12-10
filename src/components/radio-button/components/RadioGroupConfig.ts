import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import type { Ref } from 'vue'
import type { RadioButtonProps } from '../RadioButtonConfig'

export type RadioGroupProps<V> = ValidationProps<V> & {
  modelValue?: V
  label?: string
  tag?: string
  required?: boolean
  inline?: boolean
  items?: RadioButtonProps<V>[]
}

export interface RadioGroupEmits<V> {
  'update:modelValue': [value: V | undefined]
}

export interface RadioGroupContext<V> {
  inline: boolean
  onInitialize: (value: V, checked: Ref<boolean>) => void
  onCheckChanged: (value: V, checked: boolean) => void
}

export const RadioGroupContextKey = 'RadioGroupContext'
