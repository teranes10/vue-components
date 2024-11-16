import type { TableHeader, TableProps } from '../table/TableConfig'
import type { Merge } from '@teranes/utils'

export type ObjectGridHeader<T, K> = TableHeader<T, K>

export type ObjectGridProps<T, K extends string | number> = Merge<TableProps<T, K>, { headers: ObjectGridHeader<T, K>[] }>
