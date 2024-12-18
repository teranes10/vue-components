<script setup lang="ts">
import { extractTextFieldProps, TextField } from '@/components/text-field'
import { date } from '@teranes/date'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import flatpickr from 'flatpickr'
import { computed, onMounted, ref } from 'vue'
import { DatePickerDisplayFormat, type DatePickerEmits, DatePickerFormat, type DatePickerProps } from './DatePickerConfig'
import './DatePickerStyle.css'

const props = withDefaults(defineProps<DatePickerProps>(), {
  type: 'date',
})

const emit = defineEmits<DatePickerEmits>()

const textFieldProps = computed(() => extractTextFieldProps(props))

const showTimePicker = computed(() => props.type === 'time' || props.type === 'datetime')
const showDatePicker = computed(() => props.type === 'date' || props.type === 'datetime')

const format = computed(() => props.format || DatePickerFormat[props.type])
const displayFormat = computed(() => props.displayFormat || DatePickerDisplayFormat[props.type])

const modelValue = vModel(props, 'modelValue', emit)
const value = computed(() => modelValue.value
  ? date({
    format: displayFormat.value,
    date: modelValue.value,
  })
  : '')

const textFieldComponent = ref<ComponentType<typeof TextField>>()

onMounted(() => {
  if (textFieldComponent.value) {
    const inputElement = textFieldComponent.value.$refs?.inputElement as HTMLInputElement
    if (inputElement) {
      flatpickr(inputElement, {
        enableTime: showTimePicker.value,
        noCalendar: !showDatePicker.value,
        formatDate: (value: Date) => {
          modelValue.value = date({
            format: format.value,
            date: value,
          })

          return date({
            format: displayFormat.value,
            date: value,
          })
        },
      })
    }
  }
})
</script>

<template>
  <TextField ref="textFieldComponent" :model-value="value" v-bind="textFieldProps" />
</template>
