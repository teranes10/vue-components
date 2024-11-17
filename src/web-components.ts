import './assets/css/base.css'
import './assets/css/tailwind.css'
import './assets/css/web-components-styles.css'

import { defineWebComponent, registerWebComponent } from './shared/web-components'
import webComponents from './exports.json'

type RegisterOptions = { prefix?: string }

export { componentColors, type ComponentColor } from './shared/values/colors'
export { defineWebComponent, registerWebComponent } from './shared/web-components'
export async function register({ prefix = 't' }: RegisterOptions = {}) {
    const exports = (window as any)?.WebComponents || {}
    for (const [exportName, componentName] of Object.entries(webComponents)) {
        const component = exports[exportName];
        if (component) {
            const customElement = defineWebComponent(component)
            registerWebComponent(componentName, customElement, { prefix });
        }
    }
}

export * from './shared/components/link'
export * from './shared/components/group'