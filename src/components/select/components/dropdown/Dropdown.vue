<script setup lang="ts" generic="T, V, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import type { SelectInternalItem } from '../../SelectConfig'
import type { DropdownProps } from './DropdownConfig'
import { Checkbox } from '@/components/checkbox'
import { Icon } from '@/shared/components/icon'
import { Check, ChevronRight } from 'lucide'
import { computed, ref } from 'vue'
import styles from './Dropdown.module.css'

const props = defineProps<DropdownProps<T, V, K>>()

const items = computed(() => getMultiLevel(props.items || []))

function getMultiLevel(items: SelectInternalItem<T, V, K>[], result: SelectInternalItem<T, V, K>[][] = []) {
  result.push(items)

  const expanded = items.find(x => x.expanded)
  if (expanded?.items) {
    return getMultiLevel(expanded.items, result)
  }

  return result
}

function onSelect(item: SelectInternalItem<T, V, K>, level: number) {
  if (item.items) {
    props.onExpand?.(item, !item.expanded, level)
  }
  else {
    props.onSelect?.(item, !item.selected, level)
  }
}

const dropdownElement = ref<HTMLDivElement>()
const itemsContainerElement = ref<HTMLDivElement>()

defineExpose({ dropdownElement, itemsContainerElement })
</script>

<template>
  <div ref="dropdownElement" :class="styles.selectDropdown">
    <div v-if="$slots.header" :class="styles.selectDropdownHeader">
      <slot name="header" />
    </div>

    <div v-if="items?.[0]?.length" :class="[styles.selectDropdownContent, { [styles.multiLevel]: multiLevel }]">
      <slot v-if="$slots.items" name="items" :items="items" />
      <template v-else>
        <div v-for="(subItems, i) of items" id="items-container" ref="itemsContainerElement" :key="i" :class="styles.selectDropdownItemsContainer">
          <div
            v-for="item in subItems" :key="item.key"
            :class="[styles.selectDropdownItem, { [styles.active]: item.selected || item.expanded }]" @click="onSelect(item, i)"
          >
            <span v-if="multiple" :class="styles.selectDropdownItemIconContainer">
              <Checkbox size="sm" :model-value="item.selected" @update:model-value="onSelect(item, i)" />
            </span>

            <span v-else-if="item.selected" :class="styles.selectDropdownItemIconContainer">
              <Icon :icon="Check" :class="styles.selectDropdownItemIcon" />
            </span>

            <span :class="styles.selectDropdownItemText" v-text="item.text" />

            <Icon v-if="item.items" :icon="ChevronRight" :class="styles.selectDropdownExpandIcon" />
          </div>
        </div>
      </template>
    </div>

    <div v-if="footerMessage || $slots.footerMessage" :class="styles.selectDropdownMessageContainer">
      <slot v-if="$slots.footerMessage" name="footerMessage" :items="items" />
      <div v-else :class="styles.selectDropdownMessage" v-text="footerMessage" />
    </div>

    <div v-if="$slots.footer" :class="styles.selectDropdownFooter">
      <slot name="footer" />
    </div>
  </div>
</template>
