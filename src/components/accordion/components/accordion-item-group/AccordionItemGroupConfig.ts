import type { AccordionItemProps } from '../accordion-item/AccordionItemConfig'
import { IconValue } from '@/shared/components/icon'

export interface AccordionItemGroupProps {
  icon?: IconValue
  text?: string
  items?: (AccordionItemGroupProps & AccordionItemProps)[]
}
