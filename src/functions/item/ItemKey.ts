import { getValueByObjectPath, isFunction } from '@teranes/utils'

export type Key = string | number
export type ItemKey<T, K extends Key> = string | ((item: T, index: number) => K)

export function getItemKey<T, K extends Key>(item: T, index: number, value?: ItemKey<T, K>) {
  if (value == null) {
    return index
  }

  else if (isFunction(value)) {
    return value(item, index)
  }

  else {
    return getValueByObjectPath(item, value)
  }
}
