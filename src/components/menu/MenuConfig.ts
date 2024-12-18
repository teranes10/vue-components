import type { FunctionalComponent } from 'vue'

export type MenuItem = {
  icon?: FunctionalComponent<any>
  text?: string
  onSelect?: () => void
}

export type MenuProps = {
  items: MenuItem[]
}
