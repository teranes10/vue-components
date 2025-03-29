<script setup lang="ts">
import type { ButtonGroupContext, ButtonGroupProps } from './ButtonGroupConfig'
import { computed, provide } from 'vue'
import Button from '../../Button.vue'
import styles from './ButtonGroup.module.css'
import { ButtonGroupContextKey, ButtonGroupTypeClasses } from './ButtonGroupConfig'

const props = withDefaults(defineProps<ButtonGroupProps>(), {})

const ctx = computed<ButtonGroupContext>(() => ({
  type: props.type === 'boxed' ? 'text-fill' : props.type,
  color: props.color,
  size: props.size,
}))

const items = computed(() => props.items?.map(x => ({ ...ctx, ...x })))

provide(ButtonGroupContextKey, ctx)
</script>

<template>
  <div :class="[styles.btnGroup, { [ButtonGroupTypeClasses[type!]]: type }]">
    <Button
      v-for="item in items"
      v-bind="item"
      :key="item.text"
    />
    <slot />
  </div>
</template>
