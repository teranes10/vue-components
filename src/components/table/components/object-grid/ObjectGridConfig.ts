import type { Key } from '@/functions/item/ItemKey'
import type { TableEmits, TableProps } from '../../TableConfig'

export type ObjectGridProps<T, K extends Key> = TableProps<T, K> & {
  cardWidth?: number | string
}

export type ObjectGridEmits<T, K> = TableEmits<T, K>
