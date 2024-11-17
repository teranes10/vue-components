import { computed, getCurrentInstance, nextTick, onMounted, ref, toRef } from 'vue'
import { pagination, vModel } from '@teranes/vue-composables'
import { call, objectAssign } from '@teranes/utils'
import type { ItemIndex } from '@/functions/item/ItemIndex'
import { getItemIndex } from '@/functions/item/ItemIndex'
import type { ShortEmits } from '@teranes/vue-composables'
import type { TableHeader } from '@/components/table'
import type { DataTableContext, DataTableEmits, DataTableLoadOptions, DataTableOnLoadListener, DataTableProps } from './DataTableConfig'

export function useDataTableSetup<T, K extends string | number>(props: DataTableProps<T, K>, emit: ShortEmits<DataTableEmits<T, K>>) {
  const search = toRef(props, 'search')
  const params = vModel(props, 'params')

  const page = ref(1)
  const itemsPerPage = vModel(props, 'itemsPerPage', emit, 10)

  const loading = vModel(props, 'loading', emit, false)
  function setLoading(enable: boolean) {
    loading.value = enable
  }

  const headers = vModel(props, 'headers', emit, [])
  function setHeaders(values: TableHeader<T, K>[]) {
    headers.value = values
  }

  const serverSideRendering = vModel(props, 'serverSideRendering')
  if (getCurrentInstance()?.vnode.props?.onLoad) {
    serverSideRendering.value = true
  }
  function isServerSideRendering() {
    return !!serverSideRendering.value
  }

  const items = vModel(props, 'items', emit, [])
  function setItems(values: T[]) {
    items.value = values
  }

  let loadCallback: (options: DataTableLoadOptions<T>) => void
  function setOnLoadListener(cb: DataTableOnLoadListener<T>) {
    loadCallback = cb
    serverSideRendering.value = true
  }
  function onLoad(options: DataTableLoadOptions<T>) {
    emit('load', options)

    if (loadCallback) {
      call(loadCallback, options)
    }
  }

  const paginationResult = pagination(items, page, itemsPerPage, onLoad, { serverSideRendering, search, params })

  function getItems() {
    return (serverSideRendering.value ? paginationResult.items.value : items.value) as ReadonlyArray<T>
  }

  const computedItemsPerPage = computed({
    get: () => (paginationResult?.totalItems?.value || 0) < itemsPerPage.value
      ? (paginationResult?.items?.value?.length || 0)
      : itemsPerPage.value,
    set: (val) => {
      itemsPerPage.value = val
    },
  })

  const computedItemsPerPageOptions = computed(() =>
    Array.from(new Set([computedItemsPerPage.value, ...(props.itemsPerPageOptions || [])]))
      .filter(x => x <= (paginationResult.totalItems.value - ((page.value - 1) * itemsPerPage.value)))
      .sort((a, b) => a - b))

  const computedTotalPages = computed(() =>
    Math.ceil(paginationResult.totalItems.value / itemsPerPage.value))

  const computedPaginationInfo = computed(() => {
    const start = ((page.value - 1) * itemsPerPage.value) + 1
    let end = page.value * itemsPerPage.value
    if (end > paginationResult.totalItems.value) {
      end = paginationResult.totalItems.value
    }
    return `Showing ${start} to ${end} of ${paginationResult.totalItems.value} entries`
  })

  const computedLoading = computed(() => loading.value || paginationResult.isLoading.value || (!paginationResult.isSearching && paginationResult.isWaiting.value))

  function addItem(item: T) {
    if (serverSideRendering.value) {
      paginationResult.items.value.unshift(item)
      paginationResult.totalItems.value++
    }
    else {
      items.value.unshift(item)
    }
  }

  function updateItem(where: ItemIndex<T>, item: T) {
    if (serverSideRendering.value) {
      const index = getItemIndex(paginationResult.items.value, where)
      if (index > -1) {
        const _item = paginationResult.items.value[index]
        paginationResult.items.value.splice(index, 1, objectAssign(_item, item))
      }
    }
    else {
      const index = getItemIndex(items.value, where)
      if (index > -1) {
        const _item = items.value[index]
        items.value.splice(index, 1, objectAssign(_item, item))
      }
    }
  }

  function removeItem(where: ItemIndex<T>) {
    if (serverSideRendering.value) {
      const index = getItemIndex(paginationResult.items.value, where)
      if (index > -1) {
        paginationResult.items.value.splice(index, 1)
        paginationResult.totalItems.value--
      }
    }
    else {
      const index = getItemIndex(items.value, where)
      if (index > -1) {
        items.value.splice(index, 1)
      }
    }
  }

  const ctx: DataTableContext<T, K> = {
    isServerSideRendering,
    setOnLoadListener,
    setHeaders,
    getItems,
    setItems,
    addItem,
    updateItem,
    removeItem,
    notifyDataSetChanged: paginationResult.notifyDataSetChanged,
    setLoading,
  } as const

  onMounted(() => {
    nextTick(() => {
      emit('initialize', ctx)
    })
  })

  return {
    ctx,
    headers,
    items: paginationResult.items,
    totalItems: paginationResult.totalItems,
    isSearching: paginationResult.isSearching,
    isWaiting: paginationResult.isWaiting,
    isLoading: computedLoading,
    paginationInfo: computedPaginationInfo,
    itemsPerPageOptions: computedItemsPerPageOptions,
    itemsPerPage: computedItemsPerPage,
    totalPages: computedTotalPages,
    page,
  }
}
