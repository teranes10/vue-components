<script setup lang="ts" generic="T extends object, V, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import type { ComputedRef } from 'vue'
import { extractTextFieldProps, TextField } from '@/components/text-field'
import { toBaseInternalItem } from '@/functions/item/BaseInternalItem'
import { getItemKey } from '@/functions/item/ItemKey'
import { getItemValue } from '@/functions/item/ItemValue'
import { Icon } from '@/shared/components/icon'
import { debounce, isArray, isObject } from '@teranes/utils'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { ChevronDown, ChevronUp } from 'lucide'
import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import styles from './Select.module.css'
import { useSelectable } from './Selectable'
import { type ComplexSetup, filterItems, getSelectedText, type SelectEmits, type SelectEntry, type SelectInternalItem, type SelectProps } from './SelectConfig'
import { useSelectPopper } from './SelectPopper'

const props = withDefaults(defineProps<SelectProps<T, V, K>>(), {
  persistent: false,
  itemText: 'text',
  itemValue: 'value',
  itemSubItems: 'items',
  filterable: true,
  focusable: true,
  popperWidth: 'fit-content',
  popperHeight: 180,
})

const emit = defineEmits<SelectEmits<V, K>>()

const textFieldProps = computed(() => extractTextFieldProps(props))
const selected = vModel(props, 'modelValue', emit)
const expanded = vModel(props, 'expanded', emit)

const { isSelected, isExpanded, selectItem, expandItem } = useSelectable<T, V, K>({ multiple: props.multiple, selected, expanded })

function entryToSelectItems({ text, value }: SelectEntry<V>, i: number): SelectInternalItem<T | undefined, V, K> {
  const key = i as K
  return {
    ...toBaseInternalItem(undefined, i, key),
    text,
    value,
    selected: isSelected(value),
  }
}

function itemToSelectItem(item: T, i: number, options: ComplexSetup<T, V, K>): SelectInternalItem<T, V, K> {
  let key = getItemKey(item, i, options.itemKey)
  const baseItem = toBaseInternalItem(item, i, key)
  const text = getItemValue(baseItem, options.itemText!)
  const value = getItemValue(baseItem, options.itemValue!)

  baseItem.key = key = text

  let items
  if (props.multiLevel) {
    const subItems = getItemValue(baseItem, options.itemSubItems!)
    if (subItems) {
      items = toSelectItem(subItems) as SelectInternalItem<T, V, K>[]
    }
  }

  return {
    ...baseItem,
    text,
    value,
    selected: isSelected(value),
    expanded: isExpanded(key),
    items,
  }
}

function toSelectItem(items: Record<string, V> | (string | number | T | [string, V])[]) {
  if (isComplexSetup(props) && isArray(items)) {
    return items.map((item, i) => isArray(item)
      ? entryToSelectItems({ text: item[0], value: item[1] }, i)
      : isObject(item)
        ? itemToSelectItem(item, i, props)
        : entryToSelectItems({ text: item?.toString(), value: item as V }, i),
    ) || []
  }

  return Object.entries(items || {})
    .map(([text, value], i) => entryToSelectItems({ text, value }, i))
}

const isShowing = ref(false)
const text = ref<string | undefined>(undefined)
const search = ref<string | undefined>(undefined)
const debouncedSearch = ref<string | undefined>(undefined)

const _items = computed<SelectInternalItem<T | undefined, V, K>[]>(() => toSelectItem(props.items || {}))

const items = computed(() => props.filterable ? filterItems(_items.value, debouncedSearch.value) : _items.value)

const selectedText = computed(() => props.multiple ? '' : getSelectedText((_items.value || []) as SelectInternalItem<T, V, K>[]))

const selectedTags = computed(() => props.multiple ? _items.value.flatMap(x => x.items || x).filter(x => x.selected).map(x => x.text) : [])

const footerMessage = computed(() => props.footerMessage != null
  ? props.footerMessage
  : (!items.value?.length)
      ? 'No items found.'
      : '',
)

const setSearch = debounce((value?: string) => {
  debouncedSearch.value = value
}, 1000)

watch([text, isShowing, selected, () => props.items], debounce(([nText, nShow], [oText]) => {
  if (!nShow) {
    text.value = selectedText.value
    search.value = undefined
    setSearch(undefined)
  }

  const textChanged = nText !== undefined && nText !== oText
  if (nShow && textChanged) {
    search.value = text.value
    setSearch(search.value)
  }

  updateCursor()
}, 5), { immediate: true })

function isComplexSetup(props: any): props is ComplexSetup<T, V, K> {
  return Array.isArray(props.items)
}

const referenceElement = ref<HTMLElement>()
const textFieldComponent = ref<ComponentType<typeof TextField>>()

const { dropdownElement, itemsContainerElement, show, hide, toggle, debouncedToggle } = useSelectPopper({
  ...props,
  onShow() {
    text.value = undefined
  },
  onHidden() {
    text.value = undefined
  },
  onSelect,
  onExpand: expandItem,
  footerMessage,
}, {
  items: items as ComputedRef<SelectInternalItem<T, V, K>[]>,
  isShowing,
  referenceElement,
})

function onSelect(item: SelectInternalItem<T, V, K>, select: boolean, level: number) {
  if (!props.multiple) {
    hide()
  }

  selectItem(item, select, level)
}

function updateCursor() {
  const inputElement = textFieldComponent.value?.$refs?.inputElement as HTMLInputElement
  if (inputElement) {
    inputElement.style.cursor = !props.focusable ? 'pointer' : isShowing.value ? 'text' : 'pointer'
    inputElement.readOnly = !props.focusable ? true : !isShowing.value
  }
}

onMounted(() => {
  updateCursor()
})

defineExpose({
  isShowing,
  toggle,
  show,
  hide,
  text,
  search,
  selected,
  selectedText,
  selectedTags,
  textFieldComponent,
  dropdownElement,
  itemsContainerElement,
})
</script>

<template>
  <div :class="styles.select">
    <div ref="referenceElement" :class="styles.selectReference" @click="debouncedToggle">
      <TextField
        ref="textFieldComponent" v-model="text" :class="styles.selectTextField"
        :tags="multiple ? selectedTags : undefined"
        v-bind="textFieldProps"
      >
        <template #post>
          <Icon v-if="isShowing" :icon="ChevronUp" :class="styles.selectBtn" />
          <Icon v-else :icon="ChevronDown" :class="styles.selectBtn" />
        </template>
      </TextField>
    </div>
  </div>
</template>
