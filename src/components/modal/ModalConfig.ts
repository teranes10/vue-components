export interface ModalProps {
  modelValue?: boolean
  persistent?: boolean
  width?: number
}

export interface ModalEmits {
  'update:modelValue': [value: boolean]
}
