<script setup lang="ts" generic="T, K extends number | string">
import { ChevronBtn } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import { debounce } from '@teranes/utils'
import { resizeObserver } from '@teranes/vue-composables'
import { onBeforeUnmount, ref, watch } from 'vue'

import ObjectGrid from './components/object-grid/ObjectGrid.vue'
import styles from './Table.module.css'
import { mouseMoveListener, type TableEmits, type TableHeader, type TableInternalHeader, type TableProps } from './TableConfig'
import { useTableSetup } from './TableSetup'

const props = withDefaults(defineProps<TableProps<T, K>>(), {
  singleSelect: false,
  singleExpand: true,
  mobileView: 500,
})

const emit = defineEmits<TableEmits<T, K>>()

const tableSetup = useTableSetup(props, emit)

const showMobileView = ref<boolean>()
const tableContainerElement = ref<HTMLElement>()
const tableContainerRect = resizeObserver(tableContainerElement)
watch(() => typeof props.mobileView === 'boolean' ? props.mobileView : tableContainerRect.value.width <= props.mobileView, debounce((v) => {
  showMobileView.value = v
}, 50), { immediate: true })

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

function updateOverflow(overflowX: 'hidden' | 'auto') {
  if (tableContainerElement.value) {
    tableContainerElement.value.style.overflowX = overflowX
  }
}

function onRenderRow(index: number, el: HTMLElement) {
  const length = tableSetup.items.value.length
  if (length === 0 || el == null) {
    return updateOverflow('hidden')
  }

  const isLast = index + 1 === length
  if (isLast) {
    setTimeout(() => updateOverflow('auto'), 500)
  }
}

function onRenderHeader(header: TableInternalHeader<T, K>, el: HTMLTableCellElement, i: number) {
  header.headerElement = el

  const isLast = tableSetup.headers.value.length === i + 1
  if (isLast) {
    header.style ??= {}
    header.style = {
      ...header.style,
      position: 'sticky',
      top: 0,
      right: 0,
      boxShadow: 'inset 5px 0px 4px -4px rgba(82, 63, 105, 0.15)',
    }
  }
}

const resizeHandleElements = new Map<HTMLElement, { clear: () => void }>()

function onResizeHandleElement(header: TableInternalHeader<T, K>, el: HTMLElement) {
  if (!el?.parentElement || resizeHandleElements.has(el)) {
    return
  }

  const result = mouseMoveListener(el.parentElement!, {
    handleElement: el,
    omitOffset: true,
    padding: undefined,
    callback: (o) => {
      if (o.init) {
        return
      }

      header._header.width = o.w + (o.x - o.startX) + 1
    },
  })

  resizeHandleElements.set(el, result)
}

function showResizableHandle(header: TableInternalHeader<T, K>) {
  return header.resizable || (props.resizable && header.resizable !== false)
}

onBeforeUnmount(() => {
  Array.from(resizeHandleElements.values()).forEach(x => x.clear?.())
})
</script>

<template>
  <div ref="tableContainerElement" :class="styles.tableContainer">
    <ObjectGrid v-if="showMobileView === true" v-bind="props" />
    <table v-else-if="showMobileView === false" :class="[styles.table, styles.tableElevated]">
      <colgroup>
        <col
          v-for="header in tableSetup.headers.value"
          :key="header.key" :style="{
            minWidth: header.minWidth ? `${header.minWidth}px` : ``,
            maxWidth: header.maxWidth ? `${header.maxWidth}px` : ``,
            width: header.width ? `${header.width}px` : ``,
          }"
        >
      </colgroup>
      <thead :class="styles.tableHead">
        <tr :class="styles.tableRow">
          <th
            v-if="tableSetup.showExpandBtn.value || tableSetup.showSelectBox.value"
            :class="[styles.tableHeader, styles.tableOptionsContainer]"
          >
            <span :class="styles.tableOptions">
              <ChevronBtn
                v-if="tableSetup.showExpandBtn.value"
                :style="`visibility: ${tableSetup.showExpandAllBtn.value ? 'visible' : 'hidden'}`"
              />
              <Checkbox
                v-if="tableSetup.showSelectAllBox.value"
                :icon="tableSetup.isAllItemsSelected.value ? 'tick' : 'minus'"
                :model-value="tableSetup.isAnyItemSelected.value"
                @checked="(v: boolean) => tableSetup.onSelectAll(v)"
              />
            </span>
          </th>

          <th v-for="(header, i) in tableSetup.headers.value" :key="header.key" :ref="(el) => onRenderHeader(header, el, i)" :class="getCellStyles(header, 'th')" :style="{ ...(header.align && { textAlign: header.align }), ...(header.style) }">
            <slot v-if="header.text.type === 'slot'" :name="header.text.name" />

            <component :is="header.text.component" v-else-if="header.text.type === 'component'" />

            <template v-else-if="header.text.type === 'text'">
              {{ header.text.text }}
            </template>

            <span v-if="showResizableHandle(header, i)" :ref="(el) => onResizeHandleElement(header, el, i)" :class="styles.resizeHandle" />
          </th>

          <th :class="[styles.tableHeader, styles.dummy]" />
        </tr>
      </thead>

      <tbody :class="styles.tableBody">
        <tr v-for="(item, i) in tableSetup.items.value" :ref="(el) => onRenderRow(i, el)" :key="item.key" :class="styles.tableRow">
          <td
            v-if="tableSetup.showExpandBtn.value || tableSetup.showSelectBox.value"
            :class="[styles.tableData, styles.tableOptionsContainer]"
          >
            <span :class="styles.tableOptions">
              <ChevronBtn
                v-if="tableSetup.showExpandBtn.value" :model-value="item.expanded"
                @press="(v: boolean) => tableSetup.onExpand(item, v)"
              />
              <Checkbox
                v-if="tableSetup.showSelectBox.value" :model-value="item.selected"
                @checked="(v: boolean) => tableSetup.onSelect(item, v)"
              />
            </span>
          </td>

          <td v-for="header in tableSetup.headers.value" :key="header.key" :class="getCellStyles(header, 'td')" :style="{ ...(header.align && { textAlign: header.align }), ...(header.style) }">
            <slot
              v-if="header.value.type === 'slot'" :name="header.value.name" :item="item._item"
              :internal-item="item"
            />

            <component :is="header.value.component(item)" v-else-if="header.value.type === 'component'" />

            <template v-else-if="header.value.type === 'text'">
              {{ header.value.text(item) }}
            </template>
          </td>

          <td :class="[styles.tableData, styles.dummy]" />
        </tr>

        <div v-if="tableSetup.showItemsNotFound.value" :class="styles.tableMessage">
          No items found.
        </div>
      </tbody>
    </table>
  </div>
</template>
