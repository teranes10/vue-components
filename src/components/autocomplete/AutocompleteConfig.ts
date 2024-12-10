import type { PaginationLoadOptions } from '@teranes/vue-composables'

export interface AutocompleteProps<T> {
  items?: T[]
  visibleItems?: number
  itemsPerPage?: number
  searchDelay?: number
  serverSideRendering?: boolean
  params?: Record<string, any>
}

export interface AutocompleteEmits<T> {
  'load': [options: AutocompleteLoadOptions<T>]
  'update:items': [items: T[]]
  'update:itemsPerPage': [value: number]
}

export type AutocompleteLoadOptions<T> = PaginationLoadOptions<T> & {
  error: (message: string) => void
}
