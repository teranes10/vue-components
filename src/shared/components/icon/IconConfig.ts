import { type IconNode } from 'lucide'

export type IconValue = IconNode | string

export type IconProps = {
    icon?: IconValue
    strokeWidth?: number | string
    size?: number | string
    color?: string
    class?: string
    text?: string
    textSize?: string | number
    textX?: string | number
    textY?: string | number
}