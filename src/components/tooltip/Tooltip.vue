<template>
  <a v-tooltip="props" @click="onClick">
    <slot />
  </a>
</template>

<script setup lang="ts">
import { type TooltipEmits, type TooltipProps, vTooltip } from './TooltipConfig'
import './TooltipStyle.css'

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  placement: 'top',
})

defineEmits<TooltipEmits>()
</script>
