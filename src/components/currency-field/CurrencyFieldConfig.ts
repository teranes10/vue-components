import type { TextFieldCommonProps } from '@/components/text-field'

export type CurrencyFieldProps = TextFieldCommonProps<number> & {
  modelValue?: number
  increment?: number
  decrement?: number
  addCents?: boolean
}

export type CurrencyFieldEmits = {
  'update:modelValue': [value: number]
}
