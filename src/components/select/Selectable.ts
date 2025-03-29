import type { Key } from '@/functions/item/ItemKey'
import type { Arrayable } from '@teranes/utils'
import type { Ref } from 'vue'
import type { SelectInternalItem } from './SelectConfig'
import { compare, isArray } from '@teranes/utils'

type SelectableOptions<V, K> = {
  multiple: boolean
  selected: Ref<Arrayable<V> | undefined>
  expanded: Ref<Arrayable<K> | undefined>
}

export function useSelectable<T, V, K extends Key>({ multiple, selected, expanded }: SelectableOptions<V, K>) {
  let currentLevel = 0
  function validate(level: number) {
    if (!isArray(expanded.value)) {
      expanded.value = []
    }

    if (!(currentLevel === 0 || currentLevel < level)) {
      expanded.value = expanded.value?.slice(0, level)
    }

    currentLevel = level
  }

  function isSelected(value: V) {
    return isArray(selected.value)
      ? selected.value.some(x => compare(x, value))
      : compare(selected.value, value)
  }

  function selectItem(item: SelectInternalItem<T, V, K>, select: boolean, level: number) {
    validate(level)

    if (multiple) {
      if (!isArray(selected.value)) {
        selected.value = []
      }

      if (select) {
        if (!isSelected(item.value)) {
          selected.value.push(item.value)
        }
      }
      else {
        const index = selected.value.findIndex(x => compare(x, item.value))
        if (index > -1) {
          selected.value.splice(index, 1)
        }
      }
    }
    else {
      selected.value = select ? item.value : undefined
    }
  }

  function selectItems(items: SelectInternalItem<T, V, K>[], select: boolean) {
    selected.value = select ? items.map(x => x.value) : []
  }

  function isExpanded(value: K) {
    return isArray(expanded.value)
      ? expanded.value.some(x => compare(x, value))
      : compare(expanded.value, value)
  }

  function expandItem(item: SelectInternalItem<T, V, K>, expand: boolean, level: number) {
    if (!isArray(expanded.value)) {
      expanded.value = []
    }

    validate(level)

    if (expand) {
      if (!isExpanded(item.key)) {
        expanded.value.push(item.key)
      }
    }
    else {
      const index = expanded.value.findIndex(x => compare(x, item.key))
      if (index > -1) {
        expanded.value.splice(index, 1)
      }
    }
  }

  return {
    selectItem,
    selectItems,
    isSelected,
    isExpanded,
    expandItem,
  }
}
