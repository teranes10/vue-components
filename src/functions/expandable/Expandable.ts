import { compare, isArray } from '@teranes/utils'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { BaseInternalItem } from '../item/BaseInternalItem'

export type ExpandableOptions = {
  singleExpand?: boolean
}

export function useExpandable<T, K, B extends BaseInternalItem<T, K>>(
  expanded: Ref<K | K[] | undefined> = ref(),
  {
    singleExpand = true,
  } = {},
) {
  function expandItem(item: B, expand: boolean) {
    if (singleExpand) {
      expandSingleItem(item, expand)
    }
    else {
      expandMultipleItems(item, expand)
    }
  }

  function expandMultipleItems(item: B, expand: boolean) {
    if (!isArray(expanded.value)) {
      expanded.value = []
    }

    if (expand) {
      if (!expanded.value.includes(item.key)) {
        expanded.value.push(item.key)
      }
    }
    else {
      const index = expanded.value.indexOf(item.key)
      if (index > -1) {
        expanded.value.splice(index, 1)
      }
    }
  }

  function expandSingleItem(item: B, expand: boolean) {
    if (expand) {
      expanded.value = item.key
    }
    else {
      expanded.value = undefined
    }
  }

  function isExpanded(key: K) {
    return singleExpand
      ? compare(expanded.value, key)
      : isArray(expanded.value)
        ? expanded.value.includes(key)
        : false
  }

  return {
    expanded,
    expandItem,
    isExpanded,
  }
}

export type Expandable<K> = {
  expandable?: boolean
} & (SingleExpand<K> | MultipleExpand<K>)

type SingleExpand<K> = {
  singleExpand?: true
  expanded?: K
}

type MultipleExpand<K> = {
  singleExpand?: false
  expanded?: K[]
}
