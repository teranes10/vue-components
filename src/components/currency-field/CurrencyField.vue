<template>
  <TextField ref="textFieldComponent" v-bind="$attrs" :model-value="value" :class="styles.currencyField">
    <template #post>
      <div :class="styles.currencyFieldBtnGroup">
        <a :class="styles.currencyBtn" @click="decrease">
          <MinusIcon :class="styles.currencyBtnIcon" />
        </a>
        <a :class="styles.currencyBtn" @click="increase">
          <PlusIcon :class="styles.currencyBtnIcon" />
        </a>
      </div>
    </template>
  </TextField>
</template>

<script setup lang="ts">
import { PlusIcon, MinusIcon } from 'lucide-vue-next'

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { toNumber, toCurrencyString } from '@teranes/utils'
import TextField from '../text-field/TextField.vue'
import type { CurrencyFieldProps, CurrencyFieldEmits } from './CurrencyFieldConfig'
import styles from './CurrencyField.module.css'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CurrencyFieldProps>(), {
  increment: 1,
  decrement: 1,
  addCents: true,
})

const emit = defineEmits<CurrencyFieldEmits>()

const modalValue = vModel(props, 'modelValue', emit, 0)

const value = computed(() => {
  let value = toNumber(props.modelValue?.toString() || '')
  if (value < 0) {
    value = 0
  }

  return value ? toCurrencyString(value?.toString() || '', { addCents: !isInFocus }) : ''
})

const textFieldComponent = ref<ComponentType<typeof TextField>>()
let inputElement: HTMLInputElement
let isInFocus: boolean = false

onMounted(() => {
  if (textFieldComponent.value) {
    inputElement = textFieldComponent.value.$refs.inputElement as HTMLInputElement
    if (inputElement) {
      inputElement.classList.add('!pr-20')
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

const increase = (e: MouseEvent) => {
  e.preventDefault()

  const value = toNumber(inputElement.value) + props.increment
  onValueChanged(value ? value.toString() : '', true)
}

const decrease = (e: MouseEvent) => {
  e.preventDefault()

  let value = toNumber(inputElement.value) - props.decrement
  if (value < 0) {
    value = 0
  }

  onValueChanged(value ? value.toString() : '', true)
}

const onValueChanged = (val: string, addCents: boolean = false) => {
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
