export type ModalProps = {
  modelValue?: boolean
  persistent?: boolean
  width?: number
}

export type ModalEmits = {
  'update:modelValue': [value: boolean]
}
