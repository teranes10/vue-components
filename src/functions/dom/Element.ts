import { getShortUniqueId } from '@teranes/short-unique-id'
import { watchOnce } from '@teranes/vue-composables'
import { type Component, createVNode, render, shallowRef } from 'vue'

export type RenderComponentOptions = {
  debounceDelay?: number
}

export async function renderComponent(component: Component, props: Record<string, any>, { debounceDelay = 3 }: RenderComponentOptions = {}) {
  const mainContainer = getRenderContainer()

  const container = document.createElement('div')
  container.id = getShortUniqueId()
  mainContainer.append(container)

  const node = shallowRef(createVNode(component, props))
  render(node.value, container)

  const [newNode] = await watchOnce(node, { immediate: true, deep: true, debounceDelay })
  const el = newNode.el as HTMLElement

  setTimeout(() => {
    container?.remove()
  }, 10)

  return el
}

function getRenderContainer(): HTMLElement {
  if (!document) {
    throw new Error('document is undefined')
  }

  const container = document.createElement('div')
  container.id = `_elements_render_container_`
  container.style.position = 'absolute'
  container.style.width = '1px'
  container.style.height = '1px'
  container.style.padding = '0'
  container.style.margin = '-1px'
  container.style.overflow = 'hidden'
  container.style.clip = 'rect(0, 0, 0, 0)'
  container.style.whiteSpace = 'nowrap'
  container.style.borderWidth = '0'

  document.body.append(container)
  return container
};
