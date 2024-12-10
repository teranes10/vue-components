import type { IconValue } from '@/shared/components/icon'

export interface AccordionItemProps {
  icon?: IconValue
  text?: string
  active?: boolean
}

export interface AccordionItemEmits {
  'update:active': [value: boolean]
}
