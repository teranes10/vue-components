import type { IconValue } from '@/shared/components/icon'
import type { AccordionItemProps } from '../accordion-item/AccordionItemConfig'

export type AccordionItemGroupProps = {
  icon?: IconValue
  text?: string
  items?: (AccordionItemGroupProps & AccordionItemProps)[]
}
