import type { TextFieldCommonProps } from '@/components/text-field'
import type { BaseInternalItem } from '@/functions/item/BaseInternalItem'
import type { ItemComponent } from '@/functions/item/ItemComponent'
import type { ItemKey, Key } from '@/functions/item/ItemKey'
import type { ItemValue } from '@/functions/item/ItemValue'
import type { Arrayable } from '@teranes/utils'
import type { SelectPopperProps } from './SelectPopper'

export type SelectProps<T extends object, V, K extends Key> = TextFieldCommonProps<V>
  & (BasicSetup<V, K> | ComplexSetup<T, V, K>)
  & SelectPopperProps<T, V, K>
  & {
    modelValue?: Arrayable<V>
    expanded?: Arrayable<K>
    filterable?: boolean
    focusable?: boolean
  }

export type BasicSetup<V, K extends Key> = {
  items?: Record<string, V>
  itemComponent?: ItemComponent<SelectEntry<V>, K, SelectInternalItem<SelectEntry<V>, V, K>>
}

export type ComplexSetup<T, V, K extends Key> = {
  items?: (string | number | T | [string, V])[]
  itemText?: ItemValue<T, K, BaseInternalItem<T, K>, string>
  itemValue?: ItemValue<T, K, BaseInternalItem<T, K>, V>
  itemComponent?: ItemComponent<T, K, SelectInternalItem<T, V, K>>
  itemKey?: ItemKey<T, K>
  itemSubItems?: ItemValue<T, K, BaseInternalItem<T, K>, (string | number | T | [string, V])[]>
}

export type SelectEmits<V, K> = {
  'update:modelValue': [value?: Arrayable<V>]
  'update:expanded': [value?: Arrayable<K>]
}

export type SelectInternalItem<T, V, K extends Key> = BaseInternalItem<T, K> & {
  text: string
  value: V
  selected: boolean
  expanded?: boolean
  items?: SelectInternalItem<T, V, K>[]
}

export type SelectEntry<V> = { text: string, value: V }

export function getSelectedText<T, V, K extends Key>(items: SelectInternalItem<T, V, K>[], result: string[] = []) {
  const selected = items.find(x => x.selected)
  if (selected) {
    result.push(selected.text.toString())
    return result.join(' / ')
  }

  const expanded = items.find(x => x.expanded)
  if (expanded?.items) {
    result.push(expanded.text.toString())
    return getSelectedText(expanded.items, result)
  }

  return ''
}

export function filterItems<T, V, K extends Key>(items: SelectInternalItem<T, V, K>[], search?: string): SelectInternalItem<T, V, K>[] {
  return items
    .map(x => ({
      ...x,
      items: x.items ? filterItems(x.items, search) : undefined,
    }))
    .filter(x => x.text?.toLowerCase()?.includes(search?.toLowerCase() || '') || x.items?.length)
}
