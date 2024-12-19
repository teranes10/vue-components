<script setup lang="ts" generic="T extends object, V, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import type { ComplexSetup, SelectEmits, SelectEntry, SelectInternalItem, SelectProps } from './SelectConfig'
import { extractTextFieldProps, TextField } from '@/components/text-field'
import { vRender } from '@/functions/dom/Container'
import { toBaseInternalItem } from '@/functions/item/BaseInternalItem'
import { getItemKey } from '@/functions/item/ItemKey'
import { getItemValue } from '@/functions/item/ItemValue'
import { Icon } from '@/shared/components/icon'
import { type Popper, popper as usePopper } from '@teranes/popper'
import { debounce, isArray, isObject } from '@teranes/utils'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { ChevronDown, ChevronUp } from 'lucide'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import dropdownStyles from './components/dropdown/Dropdown.module.css'
import Dropdown from './components/dropdown/Dropdown.vue'
import styles from './Select.module.css'
import { useSelectable } from './SelectConfig'

const props = withDefaults(defineProps<SelectProps<T, V, K>>(), {
  persistent: false,
  itemText: 'text',
  itemValue: 'value',
  filterable: true,
  focusable: true,
})

const emit = defineEmits<SelectEmits<V>>()

const textFieldProps = computed(() => extractTextFieldProps(props))
const selected = vModel(props, 'modelValue', emit)
const { isSelected, selectItem } = useSelectable<T, V, K>({ multiple: props.multiple, selected })

const isShowing = ref(false)
const text = ref<string | undefined>(undefined)
const search = ref<string | undefined>(undefined)
const debouncedSearch = ref<string | undefined>(undefined)

const _items = computed<SelectInternalItem<T | undefined, V, K>[]>(() => {
  if (isComplexSetup(props)) {
    return props.items?.map((item, i) => isArray(item)
      ? selectEntryToSelectItems({ text: item[0], value: item[1] }, i)
      : isObject(item)
        ? itemToSelectItem(item, i, props)
        : selectEntryToSelectItems({ text: item?.toString(), value: item as V }, i),
    ) || []
  }

  return Object.entries(props.items || {}).map(([text, value], i) =>
    selectEntryToSelectItems({ text, value }, i))
})

const items = computed(() => props.filterable
  ? _items.value.filter(x =>
    x.text?.toLowerCase()?.includes(debouncedSearch.value?.toLowerCase() || ''))
  : _items.value,
)

const selectedText = computed(() => props.multiple ? '' : _items.value.find(x => x.selected)?.text?.toString() || '')
const selectedTags = computed(() => props.multiple ? _items.value.filter(x => x.selected).map(x => x.text) : [])

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

function selectEntryToSelectItems({ text, value }: SelectEntry<V>, i: number): SelectInternalItem<T | undefined, V, K> {
  const key = i as K
  return {
    ...toBaseInternalItem(undefined, i, key),
    text,
    value,
    selected: isSelected(value),
  }
}

function itemToSelectItem(item: T, i: number, options: ComplexSetup<T, V, K>): SelectInternalItem<T, V, K> {
  const key = getItemKey(item, i, options.itemKey)
  const baseItem = toBaseInternalItem(item, i, key)
  const value = getItemValue(baseItem, options.itemValue!)
  return {
    ...baseItem,
    text: getItemValue(baseItem, options.itemText!),
    value,
    selected: isSelected(value),
  }
}

function onSelect(item: SelectInternalItem<T, V, K>, select: boolean) {
  if (!props.multiple) {
    hide()
  }

  selectItem(item, select)
}

let popper: Popper | undefined

function show() {
  text.value = undefined

  if (!isShowing.value) {
    popper?.show()
  }
}

function hide() {
  if (isShowing.value) {
    popper?.hide()
  }

  nextTick(() => {
    text.value = undefined
  })
}

function toggle() {
  if (props.disabled) {
    return
  }

  isShowing.value ? hide() : show()
}

const debouncedToggle = debounce(toggle, 5)

const referenceElement = ref<HTMLDivElement>()
const textFieldComponent = ref<ComponentType<typeof TextField>>()

function updateCursor() {
  const inputElement = textFieldComponent.value?.$refs?.inputElement as HTMLInputElement
  if (inputElement) {
    inputElement.style.cursor = !props.focusable ? 'pointer' : isShowing.value ? 'text' : 'pointer'
    inputElement.readOnly = !props.focusable ? true : !isShowing.value
  }
}

const dropdownElement = ref<HTMLDivElement>()
const itemsContainerElement = ref<HTMLDivElement>()

const { node, remove } = vRender('_selects_container_', Dropdown, {
  items,
  multiple: props.multiple,
  footerMessage,
  onSelect,
}, { watchProps: true })

onMounted(() => {
  updateCursor()

  dropdownElement.value = node.component?.exposed?.dropdownElement?.value
  itemsContainerElement.value = node.component?.exposed?.itemsContainerElement?.value

  if (!referenceElement.value || !dropdownElement.value) {
    return
  }

  popper = usePopper({
    popperEl: dropdownElement.value,
    referenceEl: referenceElement.value,
    persistent: props.persistent,
    activeClass: dropdownStyles.show,
    offset: [0, 5],
    modifiers: ['same-width', 'prevent-overflow'],
    onStateChanged(type, value) {
      if (type === 'show') {
        isShowing.value = value
        value ? props.onShow?.() : props.onHide?.()
      }
    },
  })
})

onUnmounted(() => {
  popper?.destroy?.()
  remove?.()
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
      <TextField ref="textFieldComponent" v-model="text" :class="styles.selectTextField" :tags="selectedTags" v-bind="textFieldProps">
        <template #post>
          <Icon v-if="isShowing" :icon="ChevronUp" :class="styles.selectBtn" />
          <Icon v-else :icon="ChevronDown" :class="styles.selectBtn" />
        </template>
      </TextField>
    </div>
  </div>
</template>
