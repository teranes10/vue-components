import type { Component } from 'vue'
import type { BaseInternalItem } from './BaseInternalItem'

export type ItemComponent<T, K, B extends BaseInternalItem<T, K>> = ((item: T, internalItem: B) => Component)

export function getItemValue<T, K, B extends BaseInternalItem<T, K>>(item: B, value: ItemComponent<T, K, B>) {
  return value(item._item, item)
}
