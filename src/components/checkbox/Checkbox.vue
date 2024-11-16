<template>
  <span class="inline-flex align-top flex-col">
    <label :class="[styles.checkbox, {
      [styles.minusIcon]: icon === 'minus',
      [styles.squareIcon]: icon === 'square',
    }]">
      <input ref="inputElement" :class="[styles.checkboxInput, { '!border-danger': validationCtx?.isError.value }]"
        type="checkbox" :value="value" :disabled="props.disabled" :checked="checked" @change="onCheckChanged">
      <span :class="styles.checkboxLabel">
        <span v-if="label" class="ml-2" v-text="label" />
      </span>

    </label>
    <ul ref="errorsListElement" class="list-disc list-inside text-left" />
  </span>
</template>

<script setup lang="ts" generic="V">
import { computed, shallowRef, onMounted, ref, inject } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { throttle } from '@teranes/utils'
import type { ValidationFieldContext } from '../../functions/validation/ValidationConfig'
import { useFieldValidation } from '../../functions/validation/Validation'
import type { CheckboxProps, CheckboxEmits } from './CheckboxConfig'
import type { CheckBoxGroupContext } from './components/CheckboxGroupConfig'
import { CheckboxGroupContextKey } from './components/CheckboxGroupConfig'
import styles from './Checkbox.module.css'

const emit = defineEmits<CheckboxEmits>()

const props = withDefaults(defineProps<CheckboxProps<V>>(), {})

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

const group = inject<CheckBoxGroupContext<V> | undefined>(CheckboxGroupContextKey, undefined)
group?.onInitialize(value.value as V, checked)

const onCheckChanged = throttle(() => {
  checked.value = !checked.value
  group?.onCheckChanged(value.value as V, checked.value)
  emit('checked', checked.value)
})
</script>
