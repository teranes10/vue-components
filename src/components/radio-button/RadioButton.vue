<template>
  <label :class="[styles.radio, color ? radioColorStyles[color] : '']">
    <input :class="styles.radioInput" type="radio" :value="value" :checked="checked" @change="onCheckChanged">
    <span :class="styles.radioInputUi" />
    <span v-if="label" :class="styles.radioLabel" v-text="label" />
  </label>
</template>

<script setup lang="ts" generic="V">
import { computed, inject } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { throttle } from '@teranes/utils'
import type { RadioButtonProps, RadioButtonEmits } from './RadioButtonConfig'
import { radioColorStyles } from './RadioButtonConfig'
import { RadioGroupContextKey, type RadioGroupContext } from './components/RadioGroupConfig'
import styles from './RadioButton.module.css'

const props = withDefaults(defineProps<RadioButtonProps<V>>(), { color: 'primary' })

const emit = defineEmits<RadioButtonEmits>()

const value = computed(() => props.value === undefined ? props.label : props.value)

const checked = vModel(props, 'modelValue', emit, false)

const group = inject<RadioGroupContext<V> | undefined>(RadioGroupContextKey, undefined)
group?.onInitialize(value.value as V, checked)

const onCheckChanged = throttle(() => {
  checked.value = !checked.value
  group?.onCheckChanged(value.value as V, checked.value)
})
</script>
