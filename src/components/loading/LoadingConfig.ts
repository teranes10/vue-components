export interface LoadingProps {
  loading: boolean
  text?: string
}

export interface LoadingEmits {
  'update:loading': [value: boolean]
}
