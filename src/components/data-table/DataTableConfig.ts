import type { TableHeader } from '@/components/table'
import type { ItemIndex } from '@/functions/item/ItemIndex'
import type { ItemKey, Key } from '@/functions/item/ItemKey'
import type { PaginationLoadOptions } from '@teranes/vue-composables'
import type { Expandable, Selectable } from '../table/TableConfig'

export type DataTableProps<T, K extends Key> = TableCommonProps<T, K> & {
  headers: TableHeader<T, K>[]
  items: T[]
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  search?: string
  serverSideRendering?: boolean
  searchDelay?: number
  params?: { [key: string]: any }
  loading?: boolean
  onLoad?: (options: DataTableLoadOptions<T>) => void
  onInitialize?: (ctx: DataTableContext<T, K>) => void
}

export type DataTableEmits<T, K extends Key> = {
  'update:headers': [headers: TableHeader<T, K>[]]
  'update:items': [items: T[]]
  'update:itemsPerPage': [value: number]
  'update:loading': [value: boolean]
}

export type DataTableContext<T, K extends Key> = {
  isServerSideRendering: () => boolean
  setHeaders: (headers: TableHeader<T, K>[]) => void
  setOnLoadListener: (cb: DataTableOnLoadListener<T>) => void
  getItems: () => ReadonlyArray<T>
  setItems: (items: T[]) => void
  addItem: (item: T) => void
  updateItem: (where: ItemIndex<T>, item: T) => void
  removeItem: (where: ItemIndex<T>) => void
  notifyDataSetChanged: () => void
  setLoading: (enable: boolean) => void
}

export type DataTableOnLoadListener<T> = (options: DataTableLoadOptions<T>) => void

export type DataTableLoadOptions<T> = PaginationLoadOptions<T>

export type DataTableContextGetter<T, K extends Key> = { ctx: () => DataTableContext<T, K> | undefined }

export function DataTableInitializer<T, K extends Key>(
  cb?: (ctx: DataTableContext<T, K>) => void,
): DataTableContextGetter<T, K> {
  let ctx: DataTableContext<T, K> | undefined

  const mounted = (_el: HTMLElement, _binding: any, vNode: any) => {
    ctx = vNode.ctx.exposed.ctx
    if (cb) {
      cb(ctx!)
    }
  }

  return { mounted, ctx: () => ctx } as DataTableContextGetter<T, K>
}

export type TableCommonProps<T, K extends Key> = {
  itemKey?: ItemKey<T, K>
  mobileView?: boolean | number
  cardWidth?: number | string
} & Selectable<K> & Expandable<K>

export function extractTableProps<T, K extends Key>({ itemKey, mobileView, cardWidth, selectable, singleSelect, selected, expandable, singleExpand, expanded }: TableCommonProps<T, K>) {
  return { itemKey, mobileView, cardWidth, selectable, singleSelect, selected, expandable, singleExpand, expanded }
}
