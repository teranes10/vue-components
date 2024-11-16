export interface CurrencyFieldProps {
  modelValue?: number
  increment?: number
  decrement?: number
  addCents?: boolean
}

export type CurrencyFieldEmits = {
  'update:modelValue': [value: number]
}
