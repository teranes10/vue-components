import { IconValue } from '@/shared/components/icon'

export interface AccordionItemProps {
  icon?: IconValue
  text?: string
  active?: boolean
}

export type AccordionItemEmits = {
  'update:active': [value: boolean]
}