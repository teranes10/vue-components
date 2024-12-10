<script setup lang="ts">
import type { SwitchEmits, SwitchProps } from './SwitchConfig'
import { vModel } from '@teranes/vue-composables'
import styles from './Switch.module.css'
import { switchColorStyles } from './SwitchConfig'

const props = withDefaults(defineProps<SwitchProps>(), {
  color: 'primary',
})

const emit = defineEmits<SwitchEmits>()

const checked = vModel(props, 'modelValue', emit, false)

function onClick(e: MouseEvent) {
  const checkbox = e.target as HTMLInputElement
  emit('changed', checkbox.checked)
}
</script>

<template>
  <label :class="[styles.switch, { [styles.disabled]: disabled, [switchColorStyles[color] as string]: color }]">
    <input v-model="checked" :class="styles.switchInput" type="checkbox" :disabled="disabled" @click="onClick">
    <span :class="styles.switchInputUi" />
    <span v-if="label" :class="styles.switchLabel" v-text="label" />
  </label>
</template>
