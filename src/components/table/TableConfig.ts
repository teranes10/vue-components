import type { BaseInternalItem } from '@/functions/item/BaseInternalItem'
import type { ItemComponent } from '@/functions/item/ItemComponent'
import type { ItemKey, Key } from '@/functions/item/ItemKey'
import type { ItemValue } from '@/functions/item/ItemValue'
import type { Component } from 'vue'

export type TableProps<T, K extends Key> = {
  headers?: TableHeader<T, K>[]
  items?: T[]
  itemKey?: ItemKey<T, K>
  mobileView?: boolean | number
  cardWidth?: number | string
  onSelect?: (key: K, select: boolean, item: T) => void
  onSelectAll?: (keys: K[], select: boolean, items: T[]) => void
  onExpand?: (key: K, expand: boolean, item: T) => void
} & Selectable<K> & Expandable<K>

export type Selectable<K> = {
  selectable?: boolean
} & (SingleSelect<K> | MultipleSelect<K>)

type SingleSelect<K> = {
  singleSelect?: true
  selected?: K
}

type MultipleSelect<K> = {
  singleSelect?: false
  selected?: K[]
}

export type Expandable<K> = {
  expandable?: boolean
} & (SingleExpand<K> | MultipleExpand<K>)

type SingleExpand<K> = {
  singleExpand?: true
  expanded?: K
}

type MultipleExpand<K> = {
  singleExpand?: false
  expanded?: K[]
}

export type TableEmits<T, K> = {
  'update:items': [value: T[]]
  'update:selected': [value: K | K[]]
  'update:expanded': [value: K | K[]]
}

export type TableInternalItem<T, K extends Key> = BaseInternalItem<T, K> & {
  selected: boolean
  expanded: boolean
}

export type TableHeader<T, K extends Key> = {
  text: string
  value?: ItemValue<T, K, TableInternalItem<T, K>>
  component?: ItemComponent<T, K, TableInternalItem<T, K>>
  headerComponent?: Component
  class?: string
  cardClass?: string
}

export type TableInternalHeader<T, K extends Key, H = TableHeader<T, K>> = Omit<H, 'text' | 'value' | 'component' | 'headerComponent'> & {
  key: Key
  text: TableInternalHeaderText
  value: TableInternalHeaderValue<T, K>
}

export type TableInternalHeaderText =
  | { type: 'slot', name: string }
  | { type: 'component', component: Component }
  | { type: 'text', text: string }
  | { type: 'unknown' }

export type TableInternalHeaderValue<T, K extends Key> =
  | { type: 'slot', name: string }
  | { type: 'component', component: (item: TableInternalItem<T, K>) => Component }
  | { type: 'text', text: (item: TableInternalItem<T, K>) => any }
  | { type: 'unknown' }
