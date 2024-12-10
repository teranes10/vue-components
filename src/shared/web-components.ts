import { defineCustomElement } from 'vue'

export interface RegisterOptions {
  prefix?: string
}

export function registerWebComponent(name: string, component: any, { prefix = 't' }: RegisterOptions = {}) {
  customElements.define(`${prefix ? `${prefix}-` : ''}${name}`, component)
}

export interface DefineOptions {
  emits?: string[]
}

type CustomElementEvent = (e: Event) => void
type CustomElement = HTMLElement & { __customEvents: Record<string, CustomElementEvent> }

export function defineWebComponent(component: any, { emits = [] }: DefineOptions = {}) {
  return defineCustomElement(component, {
    shadowRoot: false,
    ...(emits?.length && {
      configureApp(app) {
        const componentName = component.__name

        app.mixin({
          mounted() {
            if (this._.type.__name !== componentName)
              return
            const el = this.$el?.parentElement
            setupEvents(el, emits)
          },
          beforeUnmount() {
            if (this._.type.__name !== componentName)
              return
            const el = this.$el?.parentElement
            clearEvents(el)
          },
        })
      },
    }),
  })
}

function setupEvents(el: CustomElement, emits: string[]) {
  if (!el)
    return

  el.__customEvents ??= {}

  emits.forEach((event: string) => {
    const attr = el.getAttribute(`on_${event}`)
    if (attr && !el.__customEvents[event]) {
      const listener = ((e: Event) => {
        if (!(e instanceof CustomEvent))
          return

        const func = new Function(`return ${attr.split('(')}`)()
        if (!func) {
          console.error(`Invalid function assignment. It should be in the format: on_${event}="<func_name>"`)
          return
        }

        Array.isArray(e?.detail) ? func.call(el, ...e.detail) : func.call(el, e?.detail)
      }) as CustomElementEvent

      el.addEventListener(event, listener)
      el.__customEvents[event] = listener
    }
  })
}

function clearEvents(el: CustomElement) {
  if (!el || !el.__customEvents) {
    return
  }

  for (const event in el.__customEvents) {
    if (el.__customEvents[event]) {
      el.removeEventListener(event, el.__customEvents[event])
      delete el.__customEvents[event]
    }
  }
}
