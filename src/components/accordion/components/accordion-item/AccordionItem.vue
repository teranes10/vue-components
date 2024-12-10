<script setup lang="ts">
import type { AccordionItemEmits, AccordionItemProps } from './AccordionItemConfig'
import { Icon } from '@/shared/components/icon'
import { vModel } from '@teranes/vue-composables'
import styles from './AccordionItem.module.css'

const props = defineProps<AccordionItemProps>()
const emit = defineEmits<AccordionItemEmits>()
const active = vModel(props, 'active', emit, false)

function onSelect() {
  active.value = !active.value
}
</script>

<template>
  <div :class="[styles.accordionItem, { [styles.active]: active }]" @click="onSelect">
    <Icon v-if="icon" :icon="icon" :class="styles.accordionItemIcon" />
    <span v-show="text" :class="styles.accordionItemText" v-text="text" />
    <slot />
  </div>
</template>
