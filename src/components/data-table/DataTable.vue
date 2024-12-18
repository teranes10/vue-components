<script setup lang="ts" generic="T, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import { Loading } from '@/components/loading'
import { Select } from '@/components/select'
import { Table } from '@/components/table'
import { computed, useSlots } from 'vue'
import Pagination from './components/pagination/Pagination.vue'
import styles from './DataTable.module.css'
import { type DataTableEmits, type DataTableProps, extractTableProps } from './DataTableConfig'
import { useDataTableSetup } from './DataTableSetup'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DataTableProps<T, K>>(), {
  search: '',
  searchDelay: undefined,
  itemsPerPageOptions: () => [5, 10, 15, 25, 50],
})
const emit = defineEmits<DataTableEmits<T, K>>()

const slots = useSlots()
const itemSlots = computed(() => Object.keys(slots).filter(slotName => slotName.startsWith('item.')) as `item.${string}`[])

const tableProps = computed(() => extractTableProps(props))

const tableSetup = useDataTableSetup(props as DataTableProps<T, K>, emit)

defineExpose({ ctx: tableSetup.ctx })
</script>

<template>
  <div :class="styles.dataTable">
    <Loading :loading="tableSetup.isLoading.value" />

    <Table
      v-model:items="tableSetup.items.value"
      :headers="tableSetup.headers.value" :item-key="itemKey"
      v-bind="{ ...tableProps, ...$attrs }"
    >
      <template v-for="slot in itemSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </Table>

    <div v-if="tableSetup.totalItems.value > 0" :class="styles.toolbar">
      <Pagination v-model="tableSetup.page.value" :total-pages="tableSetup.totalPages.value" />

      <div :class="styles.infoContainer">
        <div :class="styles.info" v-text="tableSetup.paginationInfo.value" />
        <Select
          v-model="tableSetup.itemsPerPage.value" :class="styles.itemsPerPage"
          :items="tableSetup.itemsPerPageOptions.value"
        />
      </div>
    </div>
  </div>
</template>
