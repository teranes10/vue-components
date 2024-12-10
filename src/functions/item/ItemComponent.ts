import type { BaseInternalItem } from './BaseInternalItem'
import { type ElementsProps, useComponentView } from '@/components/element'
import { debounce } from '@teranes/utils'
import { type Component, isVNode } from 'vue'

type ToUnion<T> = {
  [K in keyof T]: T[K] & { _type: K };
}[keyof T]

export type ItemComponent<T, K, B extends BaseInternalItem<T, K>> = ((item: T, internalItem: B) => Component | ToUnion<ElementsProps>)

export function getItemComponent<T, K, B extends BaseInternalItem<T, K>>(item: B, component: ItemComponent<T, K, B>, key?: string): Component {
  const value = component(item._item, item)
  if (isComponent(value)) {
    return value
  }

  const { _type, ...props } = value

  return useComponentView(_type, {
    ...(key && { 'modelValue': item.getValue(key), 'onUpdate:modelValue': debounce((v: any) => { item.setValue(key, v) }, 1000) }),
    ...props,
  })
}

export function isComponent(value: any): value is Component {
  return isVNode(value)
}
