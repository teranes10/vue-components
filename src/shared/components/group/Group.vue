<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import styles from './Group.module.css'

const props = defineProps<{
  flex?: (string | number)[]
  nowrap?: boolean
  full?: boolean
  justify?: CSSProperties['justify-content']
  align?: CSSProperties['align-items']
}>()

const groupStyle = computed(() => {
  const flexStyle = props.flex ? Object.fromEntries(props.flex.map((x, i) => [`--child-${i + 1}`, x])) : {}
  return {
    ...flexStyle,
    '--justify': props.justify,
    '--align': props.align,
  }
})
</script>

<template>
  <div
    :class="[styles.group, {
      [styles.full]: full || flex || justify || align,
      [styles.nowrap]: nowrap,
    }]"
    :style="groupStyle"
  >
    <slot />
  </div>
</template>
