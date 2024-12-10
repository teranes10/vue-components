<script setup lang="ts">
import type { ButtonGroupProps } from './ButtonGroupConfig'
import Button from '../../Button.vue'
import styles from './ButtonGroup.module.css'

withDefaults(defineProps<ButtonGroupProps>(), {})
</script>

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
