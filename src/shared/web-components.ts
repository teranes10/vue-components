import { defineCustomElement } from 'vue'

export type RegisterOptions = {
  prefix?: string
}

export function registerWebComponent(name: string, component: any, { prefix = 't' }: RegisterOptions = {}) {
  customElements.define(`${prefix ? `${prefix}-` : ''}${name}`, component)
}

export function defineWebComponent(component: any) {
  return defineCustomElement(component, {
    shadowRoot: false,
  })
}
