export interface NumberFieldProps {
  modelValue?: number
  increment?: number
  decrement?: number
}

export interface NumberFieldEmits {
  'update:modelValue': [value: number]
}
