<script setup lang="ts" generic="T">
import { vModel } from '@teranes/vue-composables'
import { provide } from 'vue'
import styles from './Tabs.module.css'
import { type TabsEmits, type TabsGroupContext, TabsGroupContextKey, type TabsProps } from './TabsConfig'

const props = withDefaults(defineProps<TabsProps>(), {

})
const emit = defineEmits<TabsEmits>()
const selectedValue = vModel(props, 'modelValue', emit, 0)

let tabIndex = 0
let tabContentIndex = 0

const ctx: TabsGroupContext = {
  selected: selectedValue,
  onTabInitialize() {
    const index = tabIndex++
    return index
  },
  onTabContentInitialize() {
    const index = tabContentIndex++
    return index
  },
  onSelect(index) {
    if (index == null) {
      return
    }

    this.selected.value = index
  },
}

provide(TabsGroupContextKey, ctx)
</script>

<template>
  <div :class="styles.tabs">
    <slot />
  </div>
  <div>
    <slot name="content" />
  </div>
</template>
