import type { TableEmits, TableProps } from '../../TableConfig'

export type ObjectGridProps<T, K extends string | number> = TableProps<T, K> & {
  cardWidth?: number | string
}

export type ObjectGridEmits<T, K> = TableEmits<T, K>
