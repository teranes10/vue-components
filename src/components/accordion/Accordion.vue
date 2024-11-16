<template>
  <div :class="styles.accordionItemsContainer">
    <template v-for="(item, i) in items">
      <AccordionItemGroup v-if="item.items?.length" :key="i" v-bind="item" />
      <AccordionItem v-else :key="item.text" v-bind="(item as AccordionItemProps)" />
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import AccordionItemGroup from './components/accordion-item-group/AccordionItemGroup.vue'
import AccordionItem from './components/accordion-item/AccordionItem.vue'
import type { AccordionProps } from './AccordionConfig'
import type { AccordionItemProps } from './components/accordion-item/AccordionItemConfig'
import styles from './Accordion.module.css'

defineProps<AccordionProps>()
</script>
