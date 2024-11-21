<template>
  <div :class="[styles.accordionItem, { [styles.active]: active }]" @click="onSelect">
    <Icon :icon="icon" :class="styles.accordionItemIcon" v-if="icon" />
    <span v-show="text" :class="styles.accordionItemText" v-text="text" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import styles from './AccordionItem.module.css'
import type { AccordionItemEmits, AccordionItemProps } from './AccordionItemConfig'
import { vModel } from '@teranes/vue-composables';
import { Icon } from '@/shared/components/icon'

const props = defineProps<AccordionItemProps>()
const emit = defineEmits<AccordionItemEmits>()
const active = vModel(props, 'active', emit, false)

function onSelect() {
  active.value != active.value
}
</script>