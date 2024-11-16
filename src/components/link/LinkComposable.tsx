import Link from "./Link.vue";

interface LinkViewOptions {
  class: string;
}

export function useLinkView(
  text: string,
  onClick?: () => void,
  options?: LinkViewOptions
) {
  return <Link class={options?.class} text={text} onClick={onClick} />;
}
