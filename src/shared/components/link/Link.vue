<script setup lang="ts">
import styles from './Link.module.css'

const props = defineProps<{
  text: string
  class?: string
  onPress?: () => void
}>()
</script>

<template>
  <a
    :class="[styles.link, props.class ? props.class : '']" href="javascript:void(0);" @click="onPress"
    v-text="text"
  />
</template>
