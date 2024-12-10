export interface CurrencyFieldProps {
  modelValue?: number
  increment?: number
  decrement?: number
  addCents?: boolean
}

export interface CurrencyFieldEmits {
  'update:modelValue': [value: number]
}
