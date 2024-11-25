import type { TableProps, TableEmits } from '../../TableConfig'

export type ObjectGridProps<T, K extends string | number> = TableProps<T, K>

export type ObjectGridEmits<T, K> = TableEmits<T, K>