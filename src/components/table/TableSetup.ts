import { computed, onMounted, ref, useSlots } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { getItemKey } from '../../functions/item/ItemKey'
import { useSelectable } from '../../functions/selectable/Selectable'
import { useExpandable } from '../../functions/expandable/Expandable'
import { getItemValue } from '../../functions/item/ItemValue'
import type { ShortEmits } from '@teranes/vue-composables'
import type { TableEmits, TableHeader, TableInternalHeader, TableInternalItem, TableProps } from './TableConfig'

export function useTableSetup<T, K extends string | number>(props: TableProps<T, K>, emit: ShortEmits<TableEmits<T, K>>) {
  const isMounted = ref(false)
  const slots = useSlots()

  onMounted(() => {
    isMounted.value = true
  })

  const headers = computed<TableInternalHeader<T, K>[]>(() =>
    props.headers?.map(toInternalHeader) || [],
  )

  const items = computed<TableInternalItem<T, K>[]>(() =>
    props.items?.map(toInternalItem) || [],
  )

  const showItemsNotFound = computed(() =>
    isMounted.value && !(items.value && items.value.length > 0),
  )

  // select
  const showSelectBox = computed(() =>
    props.selectable && !props.singleSelect,
  )

  const showSelectAllBox = computed(() =>
    props.selectable && !props.singleSelect,
  )

  const selected = vModel(props, 'selected', emit, [])

  const isAnyItemSelected = computed(() =>
    Array.isArray(selected.value) && selected.value.length > 0,
  )

  const isAllItemsSelected = computed(() =>
    Array.isArray(selected.value) && selected.value.length === items.value.length,
  )

  const { isSelected, selectItem, selectItems } = useSelectable<T, K>(selected, { singleSelect: props.singleSelect })

  function onSelect(item: TableInternalItem<T, K>, select: boolean) {
    emit('select', item.key, select, item._item)
    selectItem(item, select)
  }

  function onSelectAll(select: boolean) {
    const keys = items.value.map(x => x.key)
    const itemsArray = items.value.map(x => x._item)

    emit('selectAll', keys, select, itemsArray)
    selectItems(items.value, select)
  }

  // expand
  const showExpandBtn = computed(() =>
    props.expandable,
  )

  const showExpandAllBtn = computed(() =>
    props.expandable && !props.singleExpand,
  )

  const expanded = vModel(props, 'expanded', emit)

  const { isExpanded, expandItem } = useExpandable(expanded, { singleExpand: props.singleExpand })

  function onExpand(item: TableInternalItem<T, K>, expand: boolean) {
    emit('expand', item.key, expand, item._item)
    expandItem(item, expand)
  }

  function toInternalHeader(header: TableHeader<T, K>, i: number): TableInternalHeader<T, K> {
    const { text, value, headerComponent, component, ...others } = header

    return {
      key: i,
      text: toInternalHeaderText({ text, value, headerComponent }),
      value: toInternalHeaderValue({ value, component }),
      ...others,
    }
  }

  function toInternalHeaderText(header: Pick<TableHeader<T, K>, 'text' | 'value' | 'headerComponent'>): TableInternalHeader<T, K>['text'] {
    if (typeof header.value === 'string' && slots[`header.${header.value}`]) {
      return { type: 'slot', name: `header.${header.value}` }
    }

    if (header.headerComponent) {
      return { type: 'component', component: header.headerComponent }
    }

    if (header.text) {
      return { type: 'text', text: header.text }
    }

    return { type: 'unknown' }
  }

  function toInternalHeaderValue(header: Pick<TableHeader<T, K>, 'value' | 'component'>): TableInternalHeader<T, K>['value'] {
    if (typeof header.value === 'string' && slots[`item.${header.value}`]) {
      return { type: 'slot', name: `item.${header.value}` }
    }

    if (header.component) {
      const component = header.component
      return { type: 'component', component: item => component(item._item, item) }
    }

    if (header.value) {
      const value = header.value
      return {
        type: 'text', text: item => getItemValue(item, value)
      }
    }

    return { type: 'unknown' }
  }

  function toInternalItem(item: T, i: number): TableInternalItem<T, K> {
    const key = getItemKey(item, i, props.itemKey)

    return {
      _item: item,
      index: i,
      key,
      selected: !!props.selectable && isSelected(key),
      expanded: !!props.expandable && isExpanded(key),
    }
  }

  return {
    headers,
    items,
    showItemsNotFound,

    showSelectBox,
    showSelectAllBox,
    isAnyItemSelected,
    isAllItemsSelected,
    selected,
    onSelect,
    onSelectAll,

    showExpandBtn,
    showExpandAllBtn,
    expanded,
    onExpand,
  }
}
