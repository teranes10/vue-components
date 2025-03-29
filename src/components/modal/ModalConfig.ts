export type ModalProps = {
  modelValue?: boolean
  persistent?: boolean
  width?: number | string
}

export type ModalEmits = {
  'update:modelValue': [value: boolean]
}
