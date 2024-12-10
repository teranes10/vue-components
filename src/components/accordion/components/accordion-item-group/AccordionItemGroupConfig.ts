import type { IconValue } from '@/shared/components/icon'
import type { AccordionItemProps } from '../accordion-item/AccordionItemConfig'

export interface AccordionItemGroupProps {
  icon?: IconValue
  text?: string
  items?: (AccordionItemGroupProps & AccordionItemProps)[]
}
