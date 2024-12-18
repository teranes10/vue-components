import type { IconValue } from '@/shared/components/icon'

export type AccordionItemProps = {
  icon?: IconValue
  text?: string
  active?: boolean
}

export type AccordionItemEmits = {
  'update:active': [value: boolean]
}
