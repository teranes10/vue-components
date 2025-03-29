import type { ButtonProps, ButtonType } from '../../ButtonConfig'
import styles from './ButtonGroup.module.css'

type BaseProps = Pick<ButtonProps, 'color' | 'size' | 'type'>

export type ButtonGroupType = ButtonType | 'boxed'

export type ButtonGroupProps = Omit<BaseProps, 'type'> & {
  type?: ButtonGroupType
  items?: ButtonProps[]
}

export type ButtonGroupContext = BaseProps

export const ButtonGroupContextKey = 'ButtonGroupContextKey'

export const ButtonGroupTypeClasses: Record<string, string> = {
  'boxed': styles.boxed,
  'text': styles.text,
  'text-fill': styles.textFill,
}
