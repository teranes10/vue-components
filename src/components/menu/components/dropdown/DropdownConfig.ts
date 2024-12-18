import type { FunctionalComponent } from 'vue'

export type DropdownItem = {
  icon?: FunctionalComponent<any>
  text?: string
  onSelect?: () => void
}

export type DropdownProps = {
  modelValue?: boolean
  items?: DropdownItem[]
  persistent?: boolean
  block?: boolean
  sameWidth?: boolean
  disabled?: boolean
  onShow?: () => void
  onHide?: () => void
  onSelect?: (item: DropdownItem) => void
}

export type DropdownEmits = {
  'update:modelValue': [value: boolean]
}
