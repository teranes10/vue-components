<script setup lang="ts">
import { type TooltipEmits, type TooltipProps, vTooltip } from './TooltipConfig'
import './TooltipStyle.css'

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  placement: 'top',
})

defineEmits<TooltipEmits>()
</script>

<template>
  <a v-tooltip="props" @click="onPress">
    <slot />
  </a>
</template>
