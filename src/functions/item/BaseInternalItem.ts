import type { Key } from './ItemKey'
import { getValueByObjectPath, setValueByObjectPath } from '@teranes/utils'

export type BaseInternalItem<T, K extends Key> = {
  _item: T
  index: number
  key: K
  getValue: (key: string) => any
  setValue: (key: string, value: any) => void
}

export function toBaseInternalItem<T, K extends Key>(item: T, index: number, key: K): BaseInternalItem<T, K> {
  return {
    _item: item,
    index,
    key,
    getValue(key) {
      return getValueByObjectPath(this._item, key)
    },
    setValue(key, value) {
      setValueByObjectPath(this._item, key, value)
    },
  }
}
