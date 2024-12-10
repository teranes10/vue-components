export interface BaseInternalItem<T, K> {
  _item: T
  index: number
  key: K
  getValue: (key: string) => void
  setValue: (key: string, value: any) => void
}
