import Link from './Link.vue'

type LinkViewOptions = {
  class: string
}

export function useLinkView(
  text: string,
  onClick?: () => void,
  options?: LinkViewOptions,
) {
  return <Link class={options?.class} text={text} onPress={onClick} />
}
