import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import { getValueByObjectPath, isFunction, isObject } from '@teranes/utils'

export type SelectProps<T, V> = ValidationProps<V> & {
  modelValue?: V
  items?: T[]
  itemText?: SelectItemText<T>
  itemValue?: SelectItemValue<T, V>
  persistent?: boolean
  message?: string
}

export interface SelectEmits<V> {
  'update:modelValue': [value: V | undefined]
  'show': []
  'hide': []
}

export type SelectItem = Record<string, any> | number | string
export type SelectItemText<T> = string | ((item: T) => string)
export type SelectItemValue<T, V> = string | ((item: T) => V)
export interface SelectInternalItem<V> { text: string, value: V }

export function getText<T>(item: T, itemText?: SelectItemText<T>) {
  if (isFunction(itemText)) {
    return itemText(item)
  }
  if (isObject(item)) {
    return getValueByObjectPath(item, itemText || 'text')
  }
  return item
}

export function getValue<T, V>(item: T, itemValue?: SelectItemValue<T, V>) {
  if (isFunction(itemValue)) {
    return itemValue(item)
  }
  if (isObject(itemValue)) {
    return getValueByObjectPath(item, itemValue || 'value')
  }
  return item
}
