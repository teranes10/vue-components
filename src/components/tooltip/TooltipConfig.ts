
import type { Directive } from 'vue'
import tippy, { roundArrow } from 'tippy.js'

export interface TooltipProps {
  text?: string
  placement?: TooltipPlacement
}

export type TooltipEmits = {
  click: [e: MouseEvent]
}

export type TooltipPlacement = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'

export const vTooltip: Directive<HTMLElement, string | TooltipProps> = {
  mounted: (el, binding) => {
    const { text = '', placement = 'top' }
      = typeof binding.value === 'string' ? { text: binding.value } : binding.value || {}

    if (text) {
      tippy(el, {
        theme: 'light',
        content: text,
        placement,
        arrow: roundArrow,
        animation: 'scale',
        animateFill: false,
        duration: [25, 35],
        popperOptions: {
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                rootBoundary: 'viewport',
              },
            },
          ],
        },
      })
    }
  },
}
