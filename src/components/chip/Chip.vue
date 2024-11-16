<template>
  <span :class="[styles.chip, { [ChipColorClasses[props.color!]]: color && !color.startsWith('#') }]">
    <icon v-if="icon" class="w-4 h-4" />
    <span v-if="text" :class="{ 'ml-2': icon }" v-text="text" />
  </span>
</template>

<script setup lang="ts">
import { ChipColorClasses, type ChipProps } from './ChipConfig'
import styles from './Chip.module.css'

const props = withDefaults(defineProps<ChipProps>(), {
  color: 'primary',
})
</script>
