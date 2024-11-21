import './assets/css/base.css'
import './assets/css/web-components-styles.css'

export { componentColors, type ComponentColor } from './shared/values/colors'
export { defineWebComponent, registerWebComponent } from './shared/web-components'

export { useLinkView, Link } from './shared/components/link'
export { useGroupView, Group } from './shared/components/group'
export { Icon } from './shared/components/icon'

export * as Vue from './shared/libs/vue'
export * as VueComposables from './shared/libs/vue-composables'

export const componentOptions = {
    Button: {
        emits: ["clicked"],
    }
}