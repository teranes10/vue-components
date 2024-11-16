import type { PaginationLoadOptions } from '@teranes/vue-composables'
import type { ItemIndex } from '../../functions/item/ItemIndex'
import type { TableHeader } from '../table/TableConfig'

export type DataTableProps<T, K> = {
  headers: TableHeader<T, K>[]
  items: T[]
  itemKey?: string | ((item: T) => K)
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  search?: string
  serverSideRendering?: boolean
  searchDelay?: number
  params?: { [key: string]: any }
  loading?: boolean
}

export type DataTableEmits<T, K> = {
  'update:headers': [headers: TableHeader<T, K>[]]
  'update:items': [items: T[]]
  'update:itemsPerPage': [value: number]
  'load': [options: DataTableLoadOptions<T>]
  'initialize': [ctx: DataTableContext<T, K>]
  'update:loading': [value: boolean]
}

export type DataTableContext<T, K> = {
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

export type DataTableContextGetter<T, K> = { ctx: () => DataTableContext<T, K> | undefined }

export function DataTableInitializer<T, K>(
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
