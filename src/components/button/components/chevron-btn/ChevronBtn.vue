<template>
  <ChevronUp
    v-if="active"
    :class="styles.chevronBtn"
    @click="onClick(false)"
  />
  <ChevronDown
    v-else
    :class="styles.chevronBtn"
    @click="onClick(true)"
  />
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { vModel } from '@teranes/vue-composables'
import styles from './ChevronBtn.module.css'

const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  'changed': [value: boolean]
  'update:modelValue': [value: boolean]
}>()

const active = vModel(props, 'modelValue', emit, false)

function onClick(value: boolean) {
  active.value = value
  emit('changed', value)
}
</script>
