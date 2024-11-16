<template>
  <div :class="styles.btnGroup">
    <Button
      v-for="item in items"
      v-bind="item"
      :key="item.text"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Button from '../../Button.vue'
import type { ButtonGroupProps } from './ButtonGroupConfig'
import styles from './ButtonGroup.module.css'

withDefaults(defineProps<ButtonGroupProps>(), {})
</script>
