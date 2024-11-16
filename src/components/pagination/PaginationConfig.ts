export interface PaginationProps {
  modelValue: number
  totalPages: number
  totalVisible?: number
}

export type PaginationEmits = {
  'update:modelValue': [value: number]
}
