export interface LoadingProps {
  loading: boolean
  text?: string
}

export type LoadingEmits = {
  'update:loading': [value: boolean]
}
