<script setup lang="ts">
import styles from './Chip.module.css'
import { ChipColorClasses, type ChipProps } from './ChipConfig'

const props = withDefaults(defineProps<ChipProps>(), {
  color: 'primary',
})
</script>

<template>
  <span :class="[styles.chip, { [ChipColorClasses[props.color!]]: color && !color.startsWith('#') }]">
    <icon v-if="icon" :class="styles.chipIcon" />
    <span v-if="text" :class="styles.chipText" v-text="text" />
  </span>
</template>
