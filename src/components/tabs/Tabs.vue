<template>
  <ul :class="['flex']">
    <slot />
  </ul>
  <div>
    <slot name="content" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { provide } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { TabsGroupContext, TabsGroupContextKey, type TabsEmits, type TabsProps } from './TabsConfig'

const emit = defineEmits<TabsEmits>()
const props = withDefaults(defineProps<TabsProps>(), {

})

const selectedValue = vModel(props, 'modelValue', emit, 0)

let tabIndex = 0;
let tabContentIndex = 0;

const ctx: TabsGroupContext = {
  selected: selectedValue,
  onTabInitialize() {
    const index = tabIndex++
    return index;
  },
  onTabContentInitialize() {
    const index = tabContentIndex++
    return index;
  },
  onSelect(index) {
    if (index == null) {
      return
    }

    this.selected.value = index;
  },
}

provide(TabsGroupContextKey, ctx)
</script>
