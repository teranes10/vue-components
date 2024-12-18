import type { LoadingIconType } from './components/loading-icon/LoadingIconConfig'

export type LoadingProps = {
  loading?: boolean
  text?: string
  inline?: boolean
  icon?: LoadingIconType
  color?: string
}

export type LoadingEmits = {
  'update:loading': [value: boolean]
}
