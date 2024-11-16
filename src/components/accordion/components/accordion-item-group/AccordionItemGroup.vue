<template>
  <div :class="[styles.accordionItemGroup, { [styles.expanded]: isExpanded }]">
    <div :class="[styles.accordionItem]" @click="onExpand">
      <i :data-lucide="icon" :class="styles.accordionItemIcon" v-if="icon"></i>
      <span v-show="text" :class="styles.accordionItemText" v-text="text" />
      <span :class="styles.accordionItemGroupIconContainer">
        <ChevronUpIcon v-show="isExpanded" :class="styles.accordionItemGroupIcon" />
        <ChevronDownIcon v-show="!isExpanded" :class="styles.accordionItemGroupIcon" />
      </span>
    </div>

    <div v-show="isExpanded" :class="styles.accordionGroupItems">
      <template v-for="(item, i) in items">
        <AccordionItemGroup v-if="item.items?.length" v-bind="item" :key="i" />
        <AccordionItem v-else v-bind="item" :key="item.text" />
      </template>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next'
import { type AccordionItemProps } from '../accordion-item/AccordionItemConfig'
import type { AccordionItemGroupProps } from './AccordionItemGroupConfig'
import AccordionItem from '../accordion-item/AccordionItem.vue'
import styles from './AccordionItemGroup.module.css'
import { computed, ref } from 'vue'

const props = defineProps<AccordionItemGroupProps>()

const internalExpanded = ref<boolean | undefined>(undefined)

const isExpanded = computed(() => {
  if (internalExpanded.value !== undefined) {
    return internalExpanded.value
  }

  return props?.items?.some((item) => {
    function isActive(item: (AccordionItemGroupProps & AccordionItemProps)) {
      if (item.items && item.items.length > 0) {
        return item.items.some(isActive)
      }

      return item.active
    }

    return isActive(item)
  })
})

function onExpand() {
  internalExpanded.value = !isExpanded.value
}
</script>
