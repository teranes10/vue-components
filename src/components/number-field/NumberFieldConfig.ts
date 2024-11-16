export interface NumberFieldProps {
  modelValue?: number
  increment?: number
  decrement?: number
}

export type NumberFieldEmits = {
  'update:modelValue': [value: number]
}
