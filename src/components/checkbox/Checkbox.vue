<script setup lang="ts" generic="V">
import type { ValidationFieldContext } from '@/functions/validation/ValidationConfig'
import type { ComputedRef } from 'vue'
import type { CheckBoxGroupContext } from './components/CheckboxGroupConfig'
import { useFieldValidation } from '@/functions/validation/Validation'
import { throttle } from '@teranes/utils'
import { vModel } from '@teranes/vue-composables'
import { computed, inject, onMounted, ref, shallowRef } from 'vue'
import styles from './Checkbox.module.css'
import { checkboxColorStyles, type CheckboxEmits, type CheckboxProps, CheckboxSizeClasses } from './CheckboxConfig'
import { CheckboxGroupContextKey } from './components/CheckboxGroupConfig'

const props = withDefaults(defineProps<CheckboxProps<V>>(), {})

const emit = defineEmits<CheckboxEmits>()

const value = computed(() => props.value === undefined ? props.label : props.value)

const checked = vModel(props, 'modelValue', emit, false)

const inputElement = ref<HTMLInputElement>()
const errorsListElement = ref<HTMLUListElement>()
const validationCtx = shallowRef<ValidationFieldContext>()

onMounted(() => {
  if (props.rules) {
    validationCtx.value = useFieldValidation({
      rules: props.rules,
      value: checked,
      inputElement: inputElement.value,
      errorsListElement: errorsListElement.value,
    })
  }
})

const group = inject<ComputedRef<CheckBoxGroupContext<V>> | undefined>(CheckboxGroupContextKey, undefined)
group?.value?.onInitialize(value.value as V, checked)

const onCheckChanged = throttle(() => {
  checked.value = !checked.value
  group?.value?.onCheckChanged(value.value as V, checked.value)
  props.onChecked?.(checked.value)
})
</script>

<template>
  <span :class="styles.checkboxContainer">
    <label
      :class="[styles.checkbox, (color || group?.color || 'primary') ? checkboxColorStyles[(color || group?.color || 'primary')!] : '', {
        [styles.minusIcon]: (icon || group?.icon) === 'minus',
        [styles.squareIcon]: (icon || group?.icon) === 'square',
      }]"
    >
      <input
        ref="inputElement" :class="[styles.checkboxInput, { [styles.error]: validationCtx?.isError.value }]"
        type="checkbox" :value="value" :disabled="props.disabled" :checked="checked" @change="onCheckChanged"
      >
      <span :class="[styles.checkboxLabel, { [CheckboxSizeClasses[(size || group?.size)!]]: (size || group?.size) }]">
        <span v-if="label" v-text="label" />
      </span>

    </label>
    <ul ref="errorsListElement" :class="styles.checkboxErrorsContainer" />
  </span>
</template>
