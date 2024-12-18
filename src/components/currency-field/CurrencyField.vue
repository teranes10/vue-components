<script setup lang="ts">
import type { CurrencyFieldEmits, CurrencyFieldProps } from './CurrencyFieldConfig'
import { extractTextFieldProps, TextField } from '@/components/text-field'

import { Icon } from '@/shared/components/icon'
import { toCurrencyString, toNumber } from '@teranes/utils'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { Minus, Plus } from 'lucide'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import styles from './CurrencyField.module.css'

const props = withDefaults(defineProps<CurrencyFieldProps>(), {
  increment: 1,
  decrement: 1,
  addCents: true,
})

const emit = defineEmits<CurrencyFieldEmits>()

const textFieldProps = computed(() => extractTextFieldProps(props))

const textFieldComponent = ref<ComponentType<typeof TextField>>()
let inputElement: HTMLInputElement
let isInFocus: boolean = false

const modalValue = vModel(props, 'modelValue', emit, 0)

const value = computed(() => {
  let value = toNumber(props.modelValue?.toString() || '')
  if (value < 0) {
    value = 0
  }

  return value ? toCurrencyString(value?.toString() || '', { addCents: !isInFocus }) : ''
})

onMounted(() => {
  if (textFieldComponent.value) {
    inputElement = textFieldComponent.value.$refs.inputElement as HTMLInputElement
    if (inputElement) {
      inputElement.addEventListener('input', onInput)
      inputElement.addEventListener('blur', onBlur)
      inputElement.addEventListener('focus', onFocus)
    }
  }
})

onUnmounted(() => {
  if (inputElement) {
    inputElement.removeEventListener('input', onInput)
    inputElement.removeEventListener('blur', onBlur)
    inputElement.removeEventListener('focus', onFocus)
  }
})

function onInput() {
  updateValue()
}

function onFocus() {
  isInFocus = true
  updateValue()
}

function onBlur() {
  isInFocus = false
  updateValue(true)
}

function updateValue(addCents: boolean = false) {
  const value = toNumber(inputElement.value) || 0
  onValueChanged(value ? value.toString() : '', addCents)
}

function increase(e: MouseEvent) {
  e.preventDefault()

  const value = toNumber(inputElement.value) + props.increment
  onValueChanged(value ? value.toString() : '', true)
}

function decrease(e: MouseEvent) {
  e.preventDefault()

  let value = toNumber(inputElement.value) - props.decrement
  if (value < 0) {
    value = 0
  }

  onValueChanged(value ? value.toString() : '', true)
}

function onValueChanged(val: string, addCents: boolean = false) {
  const input_val = val
  if (!input_val || !inputElement) {
    inputElement.value = ''
    return
  }

  const original_len = input_val.length
  let caret_pos = inputElement.selectionStart || 0

  const currency = toCurrencyString(input_val, { addCents })
  inputElement.value = currency

  const updated_len = currency.length
  caret_pos = updated_len - original_len + caret_pos
  inputElement.setSelectionRange(caret_pos, caret_pos)

  let value = toNumber(currency) || 0
  if (value < 0) {
    value = 0
  }

  modalValue.value = value
}
</script>

<template>
  <TextField ref="textFieldComponent" v-bind="textFieldProps" :model-value="value" :class="styles.currencyField">
    <template #post>
      <div :class="styles.currencyFieldBtnGroup">
        <a :class="styles.currencyBtn" @click="decrease">
          <Icon :icon="Minus" :class="styles.currencyBtnIcon" />
        </a>
        <a :class="styles.currencyBtn" @click="increase">
          <Icon :icon="Plus" :class="styles.currencyBtnIcon" />
        </a>
      </div>
    </template>
  </TextField>
</template>
