export type ImageProps = {
  src: string
  width?: string | number
  height?: string | number
  defaultSrc?: string
  preview?: boolean | string
  hoverWindow?: boolean | string
  hoverWidth?: string | number
  hoverHeight?: string | number
  title?: string
  subTitle?: string
  alt?: string
  onPress?: () => void
}

export type ImageEmits = {}
