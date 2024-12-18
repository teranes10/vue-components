import type { SelectInternalItem } from '@/components/select'
import type { BaseInternalItem } from '@/functions/item/BaseInternalItem'
import type { ItemComponent } from '@/functions/item/ItemComponent'
import type { ItemKey, Key } from '@/functions/item/ItemKey'
import type { ItemValue } from '@/functions/item/ItemValue'
import type { Arrayable } from '@teranes/utils'
import type { PaginationLoadOptions } from '@teranes/vue-composables'
import { extractTextFieldProps, type TextFieldCommonProps } from '@/components/text-field'

export type AutocompleteProps<T, V, K extends Key> = SelectCommonProps<T, V, K> & {
  items?: T[]
  visibleItems?: number
  itemsPerPage?: number
  searchDelay?: number
  serverSideRendering?: boolean
  params?: Record<string, any>
  onLoad?: (options: AutocompleteLoadOptions<T>) => void
}

export type AutocompleteEmits<T, V> = {
  'update:modelValue': [value?: Arrayable<V>]
  'update:items': [items: T[]]
  'update:itemsPerPage': [value: number]
}

export type AutocompleteLoadOptions<T> = PaginationLoadOptions<T> & {
  error: (message: string) => void
}

export type SelectCommonProps<T, V, K extends Key> = TextFieldCommonProps<V>
  & {
    modelValue?: Arrayable<V>
    multiple?: boolean
    itemText?: ItemValue<T, K, BaseInternalItem<T, K>, string>
    itemValue?: ItemValue<T, K, BaseInternalItem<T, K>, V>
    itemComponent?: ItemComponent<T, K, SelectInternalItem<T, V, K>>
    itemKey?: ItemKey<T, K>
    persistent?: boolean
  }

export function extractSelectProps<T, V, K extends Key>({ multiple, itemText, itemValue, itemComponent, itemKey, persistent, ...others }: SelectCommonProps<T, V, K>) {
  return { multiple, itemText, itemValue, itemComponent, itemKey, persistent, ...extractTextFieldProps(others) }
}
