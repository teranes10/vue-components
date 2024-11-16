import { type Component } from 'vue'
import type { AccordionItemProps } from '../accordion-item/AccordionItemConfig'

export interface AccordionItemGroupProps {
  icon?: Component
  text?: string
  items?: (AccordionItemGroupProps & AccordionItemProps)[]
}
