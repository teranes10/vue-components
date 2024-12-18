import Image from './Image.vue'

export type ImageViewOptions = {
  width?: number
  height?: number
  alt?: string
  defaultSrc?: string
  title?: string
  subTitle?: string
  preview?: boolean
  hoverWindow?: boolean
  onClick?: () => void
}

export function useImageView(
  src: string,
  {
    width = 36,
    height = 36,
    defaultSrc,
    title,
    subTitle,
    alt,
    preview,
    onClick,
  }: ImageViewOptions = {},
) {
  return (
    <Image
      width={width}
      height={height}
      src={src}
      defaultSrc={defaultSrc}
      title={title}
      subTitle={subTitle}
      alt={alt}
      preview={preview}
      onPress={onClick}
    />
  )
}
