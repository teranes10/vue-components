import type { PaginationLoadOptions } from '@teranes/vue-composables'

export type AutocompleteProps<T> = {
  items?: T[]
  visibleItems?: number
  itemsPerPage?: number
  searchDelay?: number
  serverSideRendering?: boolean
  params?: Record<string, any>
}

export type AutocompleteEmits<T> = {
  'load': [options: AutocompleteLoadOptions<T>]
  'update:items': [items: T[]]
  'update:itemsPerPage': [value: number]
}

export type AutocompleteLoadOptions<T> = PaginationLoadOptions<T> & {
  error: (message: string) => void
}
