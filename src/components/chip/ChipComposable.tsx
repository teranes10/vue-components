import Chip from './Chip.vue'
import type { ChipProps } from './ChipConfig'

export function useChipView(options: ChipProps = {}) {
  return <Chip icon={options.icon} text={options.text} color={options.color} />
}
