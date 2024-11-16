import type { FunctionalComponent } from 'vue'

export interface DropdownItem {
  icon?: FunctionalComponent<any>
  text?: string
  onSelect?: () => void
}

export interface DropdownProps {
  modelValue?: boolean
  items?: DropdownItem[]
  persistent?: boolean
  block?: boolean
  sameWidth?: boolean
}

export type DropdownEmits = {
  'update:modelValue': [value: boolean]
  'show': []
  'hide': []
  'select': [item: DropdownItem]
}
