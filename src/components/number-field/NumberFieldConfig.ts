import type { TextFieldCommonProps } from '@/components/text-field'

export type NumberFieldProps = TextFieldCommonProps<number> & {
  modelValue?: number
  increment?: number
  decrement?: number
}

export type NumberFieldEmits = {
  'update:modelValue': [value: number]
}
