import './assets/css/base.css'
import './assets/css/tailwind.css'

import { defineWebComponent, registerWebComponent } from './shared/web-components'
import { loadScript, loadStyle } from './shared/cdn-loader'
import webComponents from './exports.json'
type WebComponent = keyof typeof webComponents
type RegisterOptions = { prefix?: string, baseUrl?: string, concurrencyLimit?: number }

export { componentColors, type ComponentColor } from './shared/values/colors'
export { defineWebComponent, registerWebComponent } from './shared/web-components'

export async function register(
    names: WebComponent[], { prefix = 't', baseUrl = 'https://unpkg.com/@teranes/web-components/dist', concurrencyLimit = 3 }: RegisterOptions = {},
) {
    const loadQueue = [...names];

    async function processNext() {
        const name = loadQueue.shift();
        if (!name) return;

        const { exports, js, css } = webComponents[name];
        await loadStyle(baseUrl + '/' + css);
        await loadScript(baseUrl + '/' + js);

        for (const [exportName, componentName] of Object.entries(exports)) {
            const component = (window as any)?.WebComponents?.[exportName];
            const customElement = defineWebComponent(component)
            registerWebComponent(componentName, customElement, { prefix });
        }

        await processNext();
    }

    const workers = Array.from({ length: concurrencyLimit }, () => processNext());
    await Promise.all(workers);
}