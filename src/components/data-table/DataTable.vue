<template>
  <div :class="styles.dataTable">
    <Loading :loading="tableSetup.isLoading.value" />

    <Table :item-key="itemKey" :headers="tableSetup.headers.value" :items="tableSetup.items.value" v-bind="$attrs">
      <template v-for="slot in itemSlots" #[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </Table>

    <div v-if="tableSetup.totalItems.value > 0" :class="styles.toolbar">
      <Pagination v-model="tableSetup.page.value" :total-pages="tableSetup.totalPages.value" />

      <div :class="styles.infoContainer">
        <div :class="styles.info" v-text="tableSetup.paginationInfo.value" />
        <Select v-model="tableSetup.itemsPerPage.value" :class="styles.itemsPerPage"
          :items="tableSetup.itemsPerPageOptions.value" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T, K extends string | number">
import { computed, useSlots } from 'vue'
import { Loading } from '@/components/loading'
import { Select } from "@/components/select"
import { Table } from '@/components/table'
import Pagination from './components/pagination/Pagination.vue'
import type { DataTableEmits, DataTableProps } from './DataTableConfig'
import styles from './DataTable.module.css'
import { useDataTableSetup } from './DataTableSetup'

defineOptions({
  inheritAttrs: false,
})

const slots = useSlots()
const itemSlots = computed(() => Object.keys(slots).filter(slotName => slotName.startsWith('item.')) as `item.${string}`[])

const emit = defineEmits<DataTableEmits<T, K>>()

const props = withDefaults(defineProps<DataTableProps<T, K>>(), {
  search: '',
  searchDelay: undefined,
  itemsPerPageOptions: () => [5, 10, 15, 25, 50],
})

const tableSetup = useDataTableSetup(props as DataTableProps<T, K>, emit)

defineExpose({ ctx: tableSetup.ctx })
</script>
