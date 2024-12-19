import type { Component, MaybeRef, VNode } from 'vue'
import { getShortUniqueId } from '@teranes/short-unique-id'
import { createVNode, isRef, render, unref, watch } from 'vue'

type RenderOptions = {
  watchProps?: boolean
}

export function vRender(id: string, type: Component, props?: Record<string, MaybeRef<any>>, { watchProps }: RenderOptions = {}) {
  const resolvedProps = resolveProps(props)
  const node = createVNode(type, resolvedProps)
  const container = getContainer(id)
  if (container && node) {
    render(node, container)

    if (watchProps && props) {
      const reactiveSources = Object.values(props).filter(isRef)
      if (reactiveSources.length > 0) {
        watch(reactiveSources, () => updateProps(node, props, container), { deep: true })
      }
    }
  }

  return {
    container,
    node,
    remove() {
      if (container) {
        render(null, container)
        container.remove()
      }
    },
  }
}

function resolveProps(props: Record<string, any> | undefined) {
  if (!props)
    return {}
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [key, unref(value)]),
  )
}

function updateProps(
  node: VNode | null,
  props: Record<string, any> | undefined,
  container: HTMLElement,
) {
  if (!node || !props) {
    return
  }

  const updatedNode = createVNode(node.type, resolveProps(props))
  render(updatedNode, container)
  node = updatedNode
}

function getContainer(id: string): HTMLElement {
  if (!document) {
    throw new Error('document not found.')
  }

  let container = document.getElementById(id)
  if (!container) {
    container = createContainer(document.body, id)
  }

  return createContainer(container, getShortUniqueId())
}

function createContainer(parent: HTMLElement, id: string) {
  const container = document.createElement('div')
  container.id = id

  parent.append(container)
  return container
}
