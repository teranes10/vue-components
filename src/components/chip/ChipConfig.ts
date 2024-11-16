import { type FunctionalComponent } from 'vue'
import styles from './Chip.module.css'

export interface ChipProps {
  icon?: FunctionalComponent
  text?: string
  color?: ChipColor
}

export type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger' | (NonNullable<unknown> & `#${string}`)

export const ChipColorClasses: Record<ChipColor, string> = {
  primary: styles.chipPrimary,
  secondary: styles.chipSecondary,
  success: styles.chipSuccess,
  info: styles.chipInfo,
  warning: styles.chipWarning,
  danger: styles.chipDanger,
}
