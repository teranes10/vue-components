<script setup lang="ts">
import type { NumberFieldEmits, NumberFieldProps } from './NumberFieldConfig'
import { extractTextFieldProps, TextField } from '@/components/text-field'
import { Icon } from '@/shared/components/icon'
import { toNumber } from '@teranes/utils'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { Minus, Plus } from 'lucide'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import styles from './NumberField.module.css'

const props = withDefaults(defineProps<NumberFieldProps>(), {
  increment: 1,
  decrement: 1,
})

const emit = defineEmits<NumberFieldEmits>()

const textFieldProps = computed(() => extractTextFieldProps(props))

const modalValue = vModel(props, 'modelValue', emit, 0)

const value = computed(() => {
  const value = toNumber(modalValue.value?.toString() || '') || 0
  return value ? value.toString() : ''
})

const textFieldComponent = ref<ComponentType<typeof TextField>>()
let inputElement: HTMLInputElement

onMounted(() => {
  if (textFieldComponent.value) {
    inputElement = textFieldComponent.value.$refs.inputElement as HTMLInputElement
    if (inputElement) {
      inputElement.addEventListener('input', onValueChanged)
    }
  }
})

onUnmounted(() => {
  if (inputElement) {
    inputElement.removeEventListener('input', onValueChanged)
  }
})

function onValueChanged() {
  const value = toNumber(inputElement.value)
  setValue(value)
}

function increase() {
  const value = toNumber(inputElement.value) + props.increment
  setValue(value)
}

function decrease() {
  let value = toNumber(inputElement.value) - props.decrement
  if (value < 0) {
    value = 0
  }

  setValue(value)
}

function setValue(value: number) {
  inputElement.value = value ? value.toString() : ''
  modalValue.value = value
}
</script>

<template>
  <TextField ref="textFieldComponent" v-bind="textFieldProps" :model-value="value" :class="styles.numberField">
    <template #post>
      <div :class="styles.numberFieldBtnGroup">
        <a :class="styles.numberBtn" @click="decrease">
          <Icon :icon="Minus" :class="styles.numberBtnIcon" />
        </a>
        <a :class="styles.numberBtn" @click="increase">
          <Icon :icon="Plus" :class="styles.numberBtnIcon" />
        </a>
      </div>
    </template>
  </TextField>
</template>
