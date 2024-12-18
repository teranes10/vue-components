import type { BaseInternalItem } from './BaseInternalItem'
import type { Key } from './ItemKey'

export type ItemValue<T, K extends Key, B extends BaseInternalItem<T, K>, V = string | number | boolean> = string | ((item: T, internalItem: B) => V)

export function getItemValue<T, K extends Key, B extends BaseInternalItem<T, K>, V>(item: B, value: ItemValue<T, K, B, V>): V {
  if (typeof value === 'function') {
    return value(item._item, item)
  }

  return item.getValue(value)
}
