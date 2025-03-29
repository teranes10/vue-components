import type { Key } from '@/functions/item/ItemKey'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { DropdownProps } from './components/dropdown/DropdownConfig'
import type { SelectInternalItem } from './SelectConfig'
import { vRender } from '@/functions/dom/Container'
import { type Popper, popper as usePopper } from '@teranes/popper'
import { debounce } from '@teranes/utils'
import { onMounted, onUnmounted, ref, unref } from 'vue'
import dropdownStyles from './components/dropdown/Dropdown.module.css'
import Dropdown from './components/dropdown/Dropdown.vue'

export type SelectPopperProps<T, V, K extends Key> = Omit<DropdownProps<T, V, K>, 'items'> & {
  persistent?: boolean
  disabled?: boolean
  popperWidth?: 'fit-content' | 'same-width' | NonNullable<unknown> & string | number
  popperHeight?: 'fit-content' | NonNullable<unknown> & string | number
  onShow?: () => void
  onShown?: () => void
  onHide?: () => void
  onHidden?: () => void
}

export type SelectPopperOptions<T, V, K extends Key> = {
  items: ComputedRef<SelectInternalItem<T, V, K>[]> | Ref<SelectInternalItem<T, V, K>[]>
  isShowing: Ref<boolean>
  referenceElement: MaybeRef<HTMLElement | undefined>
}

export function useSelectPopper<T, V, K extends Key>(props: SelectPopperProps<T, V, K>, options: SelectPopperOptions<T, V, K>) {
  let popper: Popper | undefined

  function show() {
    props.onShow?.()

    if (!options.isShowing.value) {
      popper?.show()
    }
  }

  function hide() {
    props.onHide?.()

    if (options.isShowing.value) {
      popper?.hide()
    }
  }

  function toggle() {
    if (props.disabled) {
      return
    }

    options.isShowing.value ? hide() : show()
  }

  const debouncedToggle = debounce(toggle, 5)

  const { node, remove } = vRender('_selects_container_', Dropdown, {
    items: options.items,
    multiple: props.multiple,
    multiLevel: props.multiLevel,
    footerMessage: props.footerMessage,
    onSelect: props.onSelect,
    onExpand: props.onExpand,
  }, { watchProps: true })

  const dropdownElement = ref<HTMLDivElement>()
  const itemsContainerElement = ref<HTMLDivElement>()

  onMounted(() => {
    dropdownElement.value = node.component?.exposed?.dropdownElement?.value
    itemsContainerElement.value = node.component?.exposed?.itemsContainerElement?.value
    const referenceElement = unref(options.referenceElement)
    if (!referenceElement || !dropdownElement.value) {
      return
    }

    popper = usePopper({
      popperEl: dropdownElement.value,
      referenceEl: referenceElement,
      persistent: props.persistent,
      activeClass: dropdownStyles.show,
      offset: [0, 5],
      modifiers: ['prevent-overflow', {
        name: 'size-modifier',
        enabled: true,
        phase: 'beforeWrite',
        fn: ({ state }) => {
          state.elements.popper.style.width = ''

          const referenceWidth = (state.elements?.reference as HTMLElement)?.offsetWidth || 0
          const popperWidth = state.elements?.popper?.offsetWidth || 0

          state.elements.popper.style.width
                        = props.popperWidth === 'same-width'
              ? `${referenceWidth}px`
              : props.popperWidth === 'fit-content'
                ? `${Math.max(popperWidth + 10, referenceWidth)}px`
                : `${props.popperWidth || 100}px`

          const container = state.elements?.popper.querySelector('#items-container') as HTMLElement
          if (container) {
            container.style.maxHeight
                            = props.popperHeight === 'fit-content'
                ? 'fit-content'
                : `${props.popperHeight || 100}px`
          }
        },
      }],
      onStateChanged(type, value) {
        if (type === 'show') {
          options.isShowing.value = value
          value ? props.onShown?.() : props.onHidden?.()
        }
      },
    })
  })

  onUnmounted(() => {
    popper?.destroy?.()
    remove?.()
  })

  return { dropdownElement, itemsContainerElement, show, hide, toggle, debouncedToggle }
}
