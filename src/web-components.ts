import './assets/css/base.css'
import './assets/css/web-components-styles.css'

export { Group, useGroupView } from './shared/components/group'
export { Icon } from './shared/components/icon'

export { Link, useLinkView } from './shared/components/link'
export * as Vue from './shared/libs/vue'
export * as VueComposables from './shared/libs/vue-composables'

export { type ComponentColor, componentColors } from './shared/values/colors'
export { defineWebComponent, registerWebComponent } from './shared/web-components'

export const componentOptions = {
  Button: {
    emits: ['clicked'],
  },
}
