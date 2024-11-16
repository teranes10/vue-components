import type { Component } from 'vue'
import type { ItemValue } from '../../functions/item/ItemValue'
import type { ItemComponent } from '../../functions/item/ItemComponent'
import type { Selectable } from '../../functions/selectable/Selectable'
import type { Expandable } from '../../functions/expandable/Expandable'
import type { BaseInternalItem } from '../../functions/item/BaseInternalItem'

export type TableProps<T, K extends string | number> = {
  headers?: TableHeader<T, K>[]
  items?: T[]
  itemKey?: string | ((item: T) => K)
} & Selectable<K> & Expandable<K>

export type TableEmits<T, K> = {
  'update:selected': [value: K | K[]]
  'select': [key: K, select: boolean, item: T]
  'selectAll': [keys: K[], select: boolean, items: T[]]
  'update:expanded': [value: K | K[]]
  'expand': [key: K, expand: boolean, item: T]
}

export type TableInternalItem<T, K> = BaseInternalItem<T, K> & {
  selected: boolean
  expanded: boolean
}

export type TableHeader<T, K> = {
  text: string
  value?: ItemValue<T, K, TableInternalItem<T, K>>
  component?: ItemComponent<T, K, TableInternalItem<T, K>>
  headerComponent?: Component
  class?: string
  cardClass?: string
}

export type TableInternalHeader<T, K, H = TableHeader<T, K>> = Omit<H, 'text' | 'value' | 'component' | 'headerComponent'> & {
  key: string | number
  text: TableInternalHeaderText
  value: TableInternalHeaderValue<T, K>
}

type TableInternalHeaderText =
  | { type: 'slot', name: string }
  | { type: 'component', component: Component }
  | { type: 'text', text: string }
  | { type: 'unknown' }

type TableInternalHeaderValue<T, K> =
  | { type: 'slot', name: string }
  | { type: 'component', component: (item: TableInternalItem<T, K>) => Component }
  | { type: 'text', text: (item: TableInternalItem<T, K>) => any }
  | { type: 'unknown' }
