<script setup lang="ts" generic="T, K extends number | string">
import type { ObjectGridEmits, ObjectGridProps } from './ObjectGridConfig'
import { useTableSetup } from '../../TableSetup'
import styles from './ObjectGrid.module.css'

const props = withDefaults(defineProps<ObjectGridProps<T, K>>(), {
  singleSelect: false,
  singleExpand: true,
})

const emit = defineEmits<ObjectGridEmits<T, K>>()

const tableSetup = useTableSetup(props, emit)
</script>

<template>
  <div :class="styles.objectGrid" :style="{ '--object-card-width': cardWidth ? `${cardWidth}px` : '' }">
    <div v-for="item in tableSetup.items.value" :key="item.key" :class="styles.cardView">
      <template v-for="header in tableSetup.headers.value" :key="header.key">
        <span :class="styles.cardViewKey">
          <slot v-if="header.text.type === 'slot'" :name="header.text.name" />

          <component :is="header.text.component" v-else-if="header.text.type === 'component'" />

          <template v-else-if="header.text.type === 'text'">
            {{ header.text.text }}
          </template>
        </span>

        <span :class="styles.cardViewValue">
          <slot
            v-if="header.value.type === 'slot'" :name="header.value.name" :item="item._item"
            :internal-item="item"
          />

          <component :is="header.value.component(item)" v-else-if="header.value.type === 'component'" />

          <template v-else-if="header.value.type === 'text'">
            {{ header.value.text(item) }}
          </template>
        </span>
      </template>
    </div>
  </div>
</template>
