import { isFunction, isNumber } from '@teranes/utils'

export type ItemIndex<T> = number | ((item: T) => boolean)

export function getItemIndex<T>(items: T[], where: ItemIndex<T>) {
  if (isNumber(where)) {
    return where
  }

  if (isFunction(where)) {
    return items.findIndex(where)
  }

  return -1
}
