import type { Ref } from 'vue'
import type { TabProps } from './components/tab/TabConfig'

export const TabsGroupContextKey = 'TabsGroupContextKey'

export type TabItems = Record<string, string | TabProps>

export interface TabsProps {
  modelValue: number
  items: TabItems
  tabClass?: string
}

export interface TabsEmits {
  'update:modelValue': [value: any]
}

export interface TabsGroupContext {
  selected: Ref<number>
  onTabInitialize: () => number
  onTabContentInitialize: () => number
  onSelect: (id?: number) => void
}
