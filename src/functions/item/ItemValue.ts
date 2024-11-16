import { getValueByObjectPath } from '@teranes/utils'
import type { BaseInternalItem } from './BaseInternalItem'

export type ItemValue<T, K, B extends BaseInternalItem<T, K>> = string | ((item: T, internalItem: B) => string | number | boolean)

export function getItemValue<T, K, B extends BaseInternalItem<T, K>>(item: B, value: ItemValue<T, K, B>) {
  if (typeof value === 'function') {
    return value(item._item, item)
  }

  return getValueByObjectPath(item._item, value)
}
