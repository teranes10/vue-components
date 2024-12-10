import type { ChipProps } from './ChipConfig'
import Chip from './Chip.vue'

export function useChipView(options: ChipProps = {}) {
  return <Chip icon={options.icon} text={options.text} color={options.color} />
}
