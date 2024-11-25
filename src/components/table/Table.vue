<script setup lang="ts" generic="T, K extends number | string">
import { ref, computed, onMounted } from 'vue'
import { getScreenWidth } from '@teranes/vue-composables'
import { useTableSetup } from './TableSetup'
import { Checkbox } from '@/components/checkbox'
import { ChevronBtn } from '@/components/button'
import ObjectGrid from './components/object-grid/ObjectGrid.vue'

import styles from './Table.module.css'
import type { TableHeader, TableProps, TableEmits, TableInternalHeader } from './TableConfig'

const props = withDefaults(defineProps<TableProps<T, K>>(), {
  singleSelect: false,
  singleExpand: true,
  mobileView: 500
})

const emit = defineEmits<TableEmits<T, K>>()

const tableSetup = useTableSetup(props as TableProps<T, K>, emit)

const screenWidth = getScreenWidth()
const showMobileView = computed(() => typeof props.mobileView === 'boolean' ? props.mobileView : screenWidth.value <= props.mobileView)

const tableContainerElement = ref<HTMLElement>()
onMounted(() => {
  setTimeout(() => {
    if (tableContainerElement.value) {
      tableContainerElement.value.style.overflowX = 'auto'
    }
  }, 1500)
})

function getCellStyles<T>(header: TableInternalHeader<T, K, TableHeader<T, K>>, type: 'th' | 'td') {
  const _styles: string[] = [type === 'th' ? styles.tableHeader : styles.tableData]

  if (header.class) {
    _styles.push(header.class)
  }

  if (header.text.type === 'text' && header.text.text.includes('Actions')) {
    _styles.push(styles.tableActions)
  }

  return _styles
}
</script>

<template>
  <div ref="tableContainerElement" :class="styles.tableContainer">
    <table v-if="!showMobileView" :class="[styles.table, styles.tableElevated]">
      <thead :class="styles.tableHead">
        <tr :class="styles.tableRow">
          <th v-if="tableSetup.showExpandBtn.value || tableSetup.showSelectBox.value"
            :class="[styles.tableHeader, styles.tableOptionsContainer]">
            <span :class="styles.tableOptions">
              <ChevronBtn v-if="tableSetup.showExpandBtn.value"
                :style="`visibility: ${tableSetup.showExpandAllBtn.value ? 'visible' : 'hidden'}`" />
              <Checkbox v-if="tableSetup.showSelectAllBox.value"
                :icon="tableSetup.isAllItemsSelected.value ? 'tick' : 'minus'"
                :model-value="tableSetup.isAnyItemSelected.value"
                @checked="(v: boolean) => tableSetup.onSelectAll(v)" />
            </span>
          </th>

          <th v-for="header in tableSetup.headers.value" :key="header.key" :class="getCellStyles(header, 'th')">
            <slot v-if="header.text.type === 'slot'" :name="header.text.name" />

            <component :is="header.text.component" v-else-if="header.text.type === 'component'" />

            <template v-else-if="header.text.type === 'text'">
              {{ header.text.text }}
            </template>
          </th>
        </tr>
      </thead>

      <tbody :class="styles.tableBody">
        <tr v-for="item in tableSetup.items.value" :key="item.key" :class="styles.tableRow">
          <td v-if="tableSetup.showExpandBtn.value || tableSetup.showSelectBox.value"
            :class="[styles.tableData, styles.tableOptionsContainer]">
            <span :class="styles.tableOptions">
              <ChevronBtn v-if="tableSetup.showExpandBtn.value" :model-value="item.expanded"
                @changed="(v: boolean) => tableSetup.onExpand(item, v)" />
              <Checkbox v-if="tableSetup.showSelectBox.value" :model-value="item.selected"
                @checked="(v: boolean) => tableSetup.onSelect(item, v)" />
            </span>
          </td>

          <td v-for="header in tableSetup.headers.value" :key="header.key" :class="getCellStyles(header, 'td')">
            <slot v-if="header.value.type === 'slot'" :name="header.value.name" :item="item._item"
              :internal-item="item" />

            <component :is="header.value.component(item)" v-else-if="header.value.type === 'component'" />

            <template v-else-if="header.value.type === 'text'">
              {{ header.value.text(item) }}
            </template>
          </td>
        </tr>

        <div v-if="tableSetup.showItemsNotFound.value" :class="styles.tableMessage">
          No items found.
        </div>
      </tbody>
    </table>
    <ObjectGrid v-else v-bind="props" />
  </div>
</template>
