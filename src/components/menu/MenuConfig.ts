import type { FunctionalComponent } from 'vue'

export interface MenuItem {
  icon?: FunctionalComponent<any>
  text?: string
  onSelect?: () => void
}

export interface MenuProps {
  items: MenuItem[]
}
