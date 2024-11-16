import { type Component } from 'vue'

export interface AccordionItemProps {
  icon?: Component
  text?: string
  active?: boolean
}

export type AccordionItemEmits = {
  'update:active': [value: boolean]
}