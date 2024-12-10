<script setup lang="ts" generic="T extends SelectItem, V">
import type { SelectEmits, SelectInternalItem, SelectItem, SelectProps } from './SelectConfig'
import { TextField } from '@/components/text-field'
import { Icon } from '@/shared/components/icon'
import { type Popper, popper as usePopper } from '@teranes/popper'
import { compare } from '@teranes/utils'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { Check, ChevronDown, ChevronUp } from 'lucide'
import { computed, onMounted, onUnmounted, ref, type Ref, useAttrs, watch } from 'vue'
import styles from './Select.module.css'
import { getText, getValue } from './SelectConfig'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps<T, V>>(), {
  persistent: false,
})

const emit = defineEmits<SelectEmits<V>>()

const attrs = useAttrs()

const items = computed<SelectInternalItem<V>[]>(() =>
  props.items?.map(item => ({ text: getText(item, props.itemText), value: getValue(item, props.itemValue) })) || [])

const isShowing = ref(false)
const message = computed(() => props.message !== undefined ? props.message : (!props.items || props.items.length === 0) ? 'No items found.' : '')

const text = ref('')
const value = vModel(props, 'modelValue', emit) as Ref<V | undefined>
const selectedText = ref('')

function updateTextValue() {
  if (!items.value?.length || isShowing.value) {
    return
  }

  selectedText.value = ''

  setTimeout(() => {
    selectedText.value = items.value?.find(x => compare(value.value, x.value))?.text?.toString() || ''
    text.value = selectedText.value
  }, 10)
}

function isSelected(item: SelectInternalItem<V>) {
  return compare(value.value, item.value)
}

const isSearching = ref(false)
watch([text, selectedText], ([textVal, selectedTextVal], [oldTextVal, oldSelectedTextVal]) => {
  const textChanged = textVal !== oldTextVal
  const selectedTextChanged = selectedTextVal !== oldSelectedTextVal

  isSearching.value = textChanged && !selectedTextChanged
})

watch([items, value], updateTextValue, { immediate: true })

function onSelect(item: SelectInternalItem<V>) {
  hide()
  value.value = item.value
}

let popper: Popper

function show() {
  text.value = ''

  if (!isShowing.value) {
    popper.show()
    emit('show')
  }
}

function hide() {
  if (isShowing.value) {
    popper.hide()
    emit('hide')
  }

  text.value = selectedText.value || ''
}

function toggle() {
  if (attrs?.disabled) {
    return
  }

  isShowing.value ? hide() : show()
}

const referenceElement = ref<HTMLDivElement>()
const textFieldComponent = ref<ComponentType<typeof TextField>>()
const dropdownElement = ref<HTMLDivElement>()
const itemsContainerElement = ref<HTMLDivElement>()

onMounted(() => {
  const inputElement = textFieldComponent.value?.$refs?.inputElement as HTMLInputElement
  if (inputElement) {
    inputElement.readOnly = true
    inputElement.style.cursor = 'pointer'
  }

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

defineExpose({ isShowing, toggle, show, hide, textFieldComponent, dropdownElement, itemsContainerElement, text, value, selectedText, isSearching })
</script>

<template>
  <div :class="styles.select">
    <div ref="referenceElement" :class="styles.selectReference" @click="toggle">
      <TextField ref="textFieldComponent" v-model="text" :class="styles.selectTextField" v-bind="$attrs">
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
            v-for="item in items" :key="item.text"
            :class="[styles.selectDropdownItem, { [styles.active]: isSelected(item) }]" @click="onSelect(item)"
          >
            <span v-if="value" :class="styles.selectDropdownItemIconContainer">
              <Icon :icon="Check" :class="styles.selectDropdownItemIcon" />
            </span>
            <span :class="styles.selectDropdownItemText">
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="message || $slots.message" :class="styles.selectDropdownMessageContainer">
        <slot v-if="$slots.message" name="message" :items="items" />
        <div v-else :class="styles.selectDropdownMessage" v-text="message" />
      </div>

      <div v-if="$slots.footer" :class="styles.selectDropdownFooter">
        <slot v-if="$slots.footer" name="footer" />
      </div>
    </div>
  </div>
</template>
