import { isString, getValueByObjectPath, isFunction } from '@teranes/utils'
import type { ValidationProps } from '../../functions/validation/ValidationConfig'

export type SelectProps<T, V> = ValidationProps<V> & {
  modelValue?: V
  items?: T[]
  itemText?: SelectItemText<T>
  itemValue?: SelectItemValue<T, V>
  persistent?: boolean
  message?: string
}

export type SelectEmits<V> = {
  'update:modelValue': [value: V | undefined]
  'show': []
  'hide': []
}

export type SelectItem = Record<string, any> | number | string
export type SelectItemText<T> = string | ((item: T) => string)
export type SelectItemValue<T, V> = string | ((item: T) => V)
export interface SelectInternalItem<V> { text: string, value: V }

export function getText<T>(item: T, itemText?: SelectItemText<T>) {
  if (isString(itemText)) {
    return getValueByObjectPath(item, itemText)
  }
  else if (isFunction(itemText)) {
    return itemText(item)
  }

  return item
}

export function getValue<T, V>(item: T, itemValue?: SelectItemValue<T, V>) {
  if (isString(itemValue)) {
    return getValueByObjectPath(item, itemValue)
  }
  else if (isFunction(itemValue)) {
    return itemValue(item)
  }

  return item
}
