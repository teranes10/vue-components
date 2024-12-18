<script setup lang="ts" generic="T extends object, V, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import type { ComplexSetup, SelectEmits, SelectEntry, SelectInternalItem, SelectProps } from './SelectConfig'
import { Checkbox } from '@/components/checkbox'
import { extractTextFieldProps, TextField } from '@/components/text-field'
import { toBaseInternalItem } from '@/functions/item/BaseInternalItem'
import { getItemKey } from '@/functions/item/ItemKey'
import { getItemValue } from '@/functions/item/ItemValue'
import { Icon } from '@/shared/components/icon'
import { type Popper, popper as usePopper } from '@teranes/popper'
import { debounce, isArray, isObject } from '@teranes/utils'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { Check, ChevronDown, ChevronUp } from 'lucide'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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

let popper: Popper

function show() {
  text.value = undefined

  if (!isShowing.value) {
    popper.show()
  }
}

function hide() {
  if (isShowing.value) {
    popper.hide()
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
const dropdownElement = ref<HTMLDivElement>()
const itemsContainerElement = ref<HTMLDivElement>()

function updateCursor() {
  const inputElement = textFieldComponent.value?.$refs?.inputElement as HTMLInputElement
  if (inputElement) {
    inputElement.style.cursor = !props.focusable ? 'pointer' : isShowing.value ? 'text' : 'pointer'
    inputElement.readOnly = !props.focusable ? true : !isShowing.value
  }
}

onMounted(() => {
  updateCursor()

  if (dropdownElement.value && referenceElement.value) {
    popper = usePopper({
      popperEl: dropdownElement.value,
      referenceEl: referenceElement.value,
      persistent: props.persistent,
      activeClass: styles.show,
      offset: [0, 5],
      onStateChanged(type, value) {
        if (type === 'show') {
          isShowing.value = value
          value ? props.onShow?.() : props.onHide?.()
        }
      },
    })
  }
})

onUnmounted(() => {
  if (popper) {
    popper.destroy()
  }
})

defineExpose({ isShowing, toggle, show, hide, textFieldComponent, dropdownElement, itemsContainerElement, text, search, selected, selectedText, selectedTags })
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

    <div ref="dropdownElement" :class="styles.selectDropdown">
      <div v-if="$slots.header" :class="styles.selectDropdownHeader">
        <slot name="header" />
      </div>

      <div v-if="items && items.length > 0" :class="styles.selectDropdownContent">
        <slot v-if="$slots.items" name="items" :items="items" />
        <div v-else ref="itemsContainerElement" :class="styles.selectDropdownItemsContainer">
          <div
            v-for="item in items" :key="item.key"
            :class="[styles.selectDropdownItem, { [styles.active]: item.selected }]" @click="onSelect(item, !item.selected)"
          >
            <span v-if="multiple" :class="styles.selectDropdownItemIconContainer">
              <Checkbox size="sm" :model-value="item.selected" @update:model-value="onSelect(item, !item.selected)" />
            </span>
            <span v-else-if="item.selected" :class="styles.selectDropdownItemIconContainer">
              <Icon :icon="Check" :class="styles.selectDropdownItemIcon" />
            </span>
            <span :class="styles.selectDropdownItemText">
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="footerMessage || $slots.footerMessage" :class="styles.selectDropdownMessageContainer">
        <slot v-if="$slots.footerMessage" name="footerMessage" :items="items" />
        <div v-else :class="styles.selectDropdownMessage" v-text="footerMessage" />
      </div>

      <div v-if="$slots.footer" :class="styles.selectDropdownFooter">
        <slot v-if="$slots.footer" name="footer" />
      </div>
    </div>
  </div>
</template>
