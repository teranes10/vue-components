<script setup lang="ts">
import { Icon } from '@/shared/components/icon'
import { vModel } from '@teranes/vue-composables'
import { ChevronDown, ChevronUp } from 'lucide'
import styles from './ChevronBtn.module.css'

const props = defineProps<{
  modelValue?: boolean
  onPress?: (value: boolean) => void
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const active = vModel(props, 'modelValue', emit, false)

function onClick(value: boolean) {
  active.value = value
  props.onPress?.(value)
}
</script>

<template>
  <Icon v-if="active" :icon="ChevronUp" :class="styles.chevronBtn" @click="onClick(false)" />
  <Icon v-else :icon="ChevronDown" :class="styles.chevronBtn" @click="onClick(true)" />
</template>
