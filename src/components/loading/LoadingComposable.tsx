import type { LoadingIconType } from './components/loading-icon/LoadingIconConfig'
import { vRender } from '@/functions/dom/Container'
import Loading from './Loading.vue'

type LoadingOptions = {
  inline?: boolean
  icon?: LoadingIconType
  color?: string
}

export function useLoading(text?: string, { inline, icon, color }: LoadingOptions = {}) {
  const { remove } = vRender('_loadings_container_', Loading, {
    loading: true,
    text,
    inline,
    icon,
    color,
  })

  return { remove }
}
