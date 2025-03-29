<script setup lang="ts" generic="V">
import type { ComputedRef } from 'vue'
import type { RadioButtonEmits, RadioButtonProps } from './RadioButtonConfig'
import { Button } from '@/components/button'
import { throttle } from '@teranes/utils'
import { vModel } from '@teranes/vue-composables'
import { computed, inject } from 'vue'
import { type RadioGroupContext, RadioGroupContextKey } from './components/RadioGroupConfig'
import styles from './RadioButton.module.css'
import { radioButtonSizeClasses, radioColorStyles } from './RadioButtonConfig'

const props = withDefaults(defineProps<RadioButtonProps<V>>(), { })

const emit = defineEmits<RadioButtonEmits>()

const value = computed(() => props.value === undefined ? props.label : props.value)

const checked = vModel(props, 'modelValue', emit, false)

const group = inject<ComputedRef<RadioGroupContext<V>> | undefined>(RadioGroupContextKey, undefined)
group?.value?.onInitialize(value.value as V, checked)

const onCheckChanged = throttle(() => {
  checked.value = !checked.value
  group?.value?.onCheckChanged(value.value as V, checked.value)
})
</script>

<template>
  <Button v-if="(type || group?.type)" :type="(type || group?.type)" :color="(color || group?.color || 'primary')" :size="(size || group?.size)" :text="label" :active="checked" @press="onCheckChanged" />

  <label v-else :class="[styles.radio, (color || group?.color || 'primary') ? radioColorStyles[(color || group?.color || 'primary')!] : '']">
    <input
      :class="[styles.radioInput]"
      type="radio" :value="value" :checked="checked" @click="onCheckChanged"
    >
    <span :class="[styles.radioLabel, { [radioButtonSizeClasses[(size || group?.size)!]]: !!(size || group?.size) }]">
      <span v-if="label" v-text="label" />
    </span>
  </label>
</template>
