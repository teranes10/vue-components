<script setup lang="ts">
import styles from './Link.module.css'

const props = defineProps<{
  text: string
  class?: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <a
    :class="[styles.link, props.class ? props.class : '']" href="javascript:void(0);" @click="onClick"
    v-text="text"
  />
</template>
