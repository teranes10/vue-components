<template>
  <label :class="[styles.switch, color ? switchColorStyles[color] : '']">
    <input
      v-model="checked"
      :class="styles.switchInput"
      type="checkbox"
      :disabled="disabled"
      @click="onClick"
    >
    <span :class="styles.switchInputUi" />
    <span
      v-if="label"
      :class="styles.switchLabel"
      v-text="label"
    />
  </label>
</template>

<script setup lang="ts">
import { vModel } from '@teranes/vue-composables'
import { type SwitchProps, type SwitchEmits } from './SwitchConfig'
import { switchColorStyles } from './SwitchConfig'
import styles from './Switch.module.css'

const emit = defineEmits<SwitchEmits>()

const props = withDefaults(defineProps<SwitchProps>(), {
  color: 'primary',
})

const checked = vModel(props, 'modelValue', emit, false)

const onClick = (e: MouseEvent) => {
  const checkbox = e.target as HTMLInputElement
  emit('changed', checkbox.checked)
}
</script>
