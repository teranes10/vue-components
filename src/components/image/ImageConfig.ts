export type ImageProps = {
    src: string,
    width?: number,
    height?: number,
    defaultSrc?: string,
    preview?: boolean | string,
    hoverWindow?: boolean | string,
    title?: string,
    subTitle?: string,
    alt?: string
}

export type ImageEmits = {
    'click': []
}