import type { Ref } from 'vue'
import type { TabProps } from './components/tab/TabConfig'

export const TabsGroupContextKey = 'TabsGroupContextKey'

export type TabItems = Record<string, string | TabProps>

export type TabsProps = {
  modelValue: number
  items: TabItems
  tabClass?: string
}

export type TabsEmits = {
  'update:modelValue': [value: any]
}

export type TabsGroupContext = {
  selected: Ref<number>
  onTabInitialize: () => number
  onTabContentInitialize: () => number
  onSelect: (id?: number) => void
}
