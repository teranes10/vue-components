<script setup lang="ts" generic="T, V, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import type { SelectInternalItem } from '../../SelectConfig'
import { Checkbox } from '@/components/checkbox'
import { Icon } from '@/shared/components/icon'
import { Check } from 'lucide'
import { ref } from 'vue'
import styles from './Dropdown.module.css'

defineProps<{
  items: SelectInternalItem<T, V, K>[]
  onSelect: (item: SelectInternalItem<T, V, K>, select: boolean) => void
  multiple?: boolean
  footerMessage?: string
}>()

const dropdownElement = ref<HTMLDivElement>()
const itemsContainerElement = ref<HTMLDivElement>()

defineExpose({ dropdownElement, itemsContainerElement })
</script>

<template>
  <div ref="dropdownElement" :class="styles.selectDropdown">
    <div v-if="$slots.header" :class="styles.selectDropdownHeader">
      <slot name="header" />
    </div>

    <div v-if="items && items.length > 0" :class="styles.selectDropdownContent">
      <slot v-if="$slots.items" name="items" :items="items" />
      <div v-else ref="itemsContainerElement" :class="styles.selectDropdownItemsContainer">
        <div
          v-for="item in items" :key="item.key"
          :class="[styles.selectDropdownItem, { [styles.active]: item.selected }]" @click="onSelect(item, !item.selected)"
        >
          <span v-if="multiple" :class="styles.selectDropdownItemIconContainer">
            <Checkbox size="sm" :model-value="item.selected" @update:model-value="onSelect(item, !item.selected)" />
          </span>
          <span v-else-if="item.selected" :class="styles.selectDropdownItemIconContainer">
            <Icon :icon="Check" :class="styles.selectDropdownItemIcon" />
          </span>
          <span :class="styles.selectDropdownItemText">
            {{ item.text }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="footerMessage || $slots.footerMessage" :class="styles.selectDropdownMessageContainer">
      <slot v-if="$slots.footerMessage" name="footerMessage" :items="items" />
      <div v-else :class="styles.selectDropdownMessage" v-text="footerMessage" />
    </div>

    <div v-if="$slots.footer" :class="styles.selectDropdownFooter">
      <slot v-if="$slots.footer" name="footer" />
    </div>
  </div>
</template>
