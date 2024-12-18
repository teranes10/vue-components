import type { BaseInternalItem } from '../item/BaseInternalItem'
import type { Key } from '../item/ItemKey'
import { compare, isArray } from '@teranes/utils'
import { type Ref, ref } from 'vue'

export function useSelectable<T, K extends Key>(
  selected: Ref<K | K[] | undefined> = ref(),
  {
    singleSelect = false,
  } = {},
) {
  function selectItem(item: BaseInternalItem<T, K>, select: boolean) {
    if (singleSelect) {
      selectSingleItem(item, select)
    }
    else {
      selectMultipleItems(item, select)
    }
  }

  function selectItems(items: BaseInternalItem<T, K>[], select: boolean) {
    selected.value = select ? items.map(x => x.key) || [] : []
  }

  function selectMultipleItems(item: BaseInternalItem<T, K>, select: boolean) {
    if (!isArray(selected.value)) {
      selected.value = []
    }

    if (select) {
      if (!selected.value.includes(item.key)) {
        selected.value.push(item.key)
      }
    }
    else {
      const index = selected.value.indexOf(item.key)
      if (index > -1) {
        selected.value.splice(index, 1)
      }
    }
  }

  function selectSingleItem(item: BaseInternalItem<T, K>, select: boolean) {
    if (select) {
      selected.value = item.key
    }
    else {
      selected.value = undefined
    }
  }

  function isSelected(key: K) {
    return singleSelect
      ? compare(selected.value, key)
      : isArray(selected.value)
        ? selected.value.includes(key)
        : false
  }

  return {
    selected,
    selectItem,
    selectItems,
    isSelected,
  }
}
