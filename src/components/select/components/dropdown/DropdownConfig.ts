import type { Key } from '@/functions/item/ItemKey'
import type { SelectInternalItem } from '../../SelectConfig'

export type DropdownProps<T, V, K extends Key> = {
  items: SelectInternalItem<T, V, K>[]
  onSelect?: (item: SelectInternalItem<T, V, K>, select: boolean, level: number) => void
  onExpand?: (item: SelectInternalItem<T, V, K>, expand: boolean, level: number) => void
  multiple?: boolean
  multiLevel?: boolean
  footerMessage?: string
}
