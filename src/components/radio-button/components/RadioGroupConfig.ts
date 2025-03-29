import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import type { Ref } from 'vue'
import type { ButtonGroupType } from '../../button/components/button-group/ButtonGroupConfig'
import type { RadioButtonProps } from '../RadioButtonConfig'
import styles from './RadioGroup.module.css'

type BaseProps<V> = Pick<RadioButtonProps<V>, 'type' | 'color' | 'size'>

export type RadioGroupProps<V> = ValidationProps<V> & Omit<BaseProps<V>, 'type'> & {
  modelValue?: V
  label?: string
  tag?: string
  required?: boolean
  inline?: boolean
  items?: RadioButtonProps<V>[]
  type?: ButtonGroupType
}

export type RadioGroupEmits<V> = {
  'update:modelValue': [value: V | undefined]
}

export type RadioGroupContext<V> = BaseProps<V> & {
  inline: boolean
  onInitialize: (value: V, checked: Ref<boolean>) => void
  onCheckChanged: (value: V, checked: boolean) => void
}

export type RadioGroupSize = 'sm' | 'lg'

export const RadioGroupSizeClasses: Record<RadioGroupSize, string> = {
  sm: styles.sm,
  lg: styles.lg,
}

export const RadioGroupContextKey = 'RadioGroupContext'
