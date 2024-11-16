import { Ref } from "vue"
import { TabProps } from "./components/tab/TabConfig"

export const TabsGroupContextKey = 'TabsGroupContextKey'

export type TabItems = Record<string, string | TabProps>

export interface TabsProps {
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
