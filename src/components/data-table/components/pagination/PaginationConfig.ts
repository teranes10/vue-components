export interface PaginationProps {
  modelValue: number
  totalPages: number
  totalVisible?: number
}

export interface PaginationEmits {
  'update:modelValue': [value: number]
}
