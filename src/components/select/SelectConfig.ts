import type { TextFieldCommonProps } from '@/components/text-field'
import type { BaseInternalItem } from '@/functions/item/BaseInternalItem'
import type { ItemComponent } from '@/functions/item/ItemComponent'
import type { ItemKey, Key } from '@/functions/item/ItemKey'
import type { ItemValue } from '@/functions/item/ItemValue'
import type { Arrayable } from '@teranes/utils'
import type { Ref } from 'vue'
import { compare, isArray } from '@teranes/utils'

export type SelectProps<T extends object, V, K extends Key> = TextFieldCommonProps<V>
  & (BasicSetup<V, K> | ComplexSetup<T, V, K>)
  & {
    modelValue?: Arrayable<V>
    multiple?: boolean
    persistent?: boolean
    footerMessage?: string
    filterable?: boolean
    focusable?: boolean
    onShow?: () => void
    onHide?: () => void
  }

export type BasicSetup<V, K extends Key> = {
  items?: Record<string, V>
  itemComponent?: ItemComponent<SelectEntry<V>, K, SelectInternalItem<SelectEntry<V>, V, K>>
}

export type ComplexSetup<T, V, K extends Key> = {
  items?: (string | number | T | [string, V])[]
  itemText?: ItemValue<T, K, BaseInternalItem<T, K>, string>
  itemValue?: ItemValue<T, K, BaseInternalItem<T, K>, V>
  itemComponent?: ItemComponent<T, K, SelectInternalItem<T, V, K>>
  itemKey?: ItemKey<T, K>
}

export type SelectEmits<V> = {
  'update:modelValue': [value?: Arrayable<V>]
}

export type SelectInternalItem<T, V, K extends Key> = BaseInternalItem<T, K> & {
  text: string
  value: V
  selected: boolean
}

export type SelectEntry<V> = { text: string, value: V }

type SelectableOptions<V> = {
  multiple: boolean
  selected: Ref<Arrayable<V> | undefined>
}

export function useSelectable<T, V, K extends Key>({ multiple, selected }: SelectableOptions<V>) {
  function isSelected(value: V) {
    return isArray(selected.value)
      ? selected.value.some(x => compare(x, value))
      : compare(selected.value, value)
  }

  function selectItem(item: SelectInternalItem<T, V, K>, select: boolean) {
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

  return {
    selectItem,
    selectItems,
    isSelected,
  }
}
