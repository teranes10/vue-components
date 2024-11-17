import type { Ref } from 'vue'
import type { RadioButtonProps } from '../RadioButtonConfig'
import type { ValidationProps } from '@/functions/validation/ValidationConfig'

export type RadioGroupProps<V> = ValidationProps<V> & {
  modelValue?: V
  label?: string
  tag?: string
  required?: boolean
  inline?: boolean
  items?: RadioButtonProps<V>[]
}

export type RadioGroupEmits<V> = {
  'update:modelValue': [value: V | undefined]
}

export interface RadioGroupContext<V> {
  inline: boolean
  onInitialize: (value: V, checked: Ref<boolean>) => void
  onCheckChanged: (value: V, checked: boolean) => void
}

export const RadioGroupContextKey = 'RadioGroupContext'
