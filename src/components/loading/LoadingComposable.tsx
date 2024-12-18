import type { LoadingIconType } from './components/loading-icon/LoadingIconConfig'
import { getContainer } from '@/functions/dom/Container'
import { createVNode, render } from 'vue'
import Loading from './Loading.vue'

type LoadingOptions = {
  inline?: boolean
  icon?: LoadingIconType
  color?: string
}

export function useLoading(text?: string, { inline, icon, color }: LoadingOptions = {}) {
  const container = getContainer('_loadings_container_')
  if (!container) {
    throw new Error('Container not found for loading component.')
  }

  const node = createVNode(Loading, { loading: true, text, inline, icon, color })
  render(node, container)

  function hide() {
    if (container) {
      render(null, container)
      container.remove()
    }
  }

  return { hide }
}
