import type { ModalProps } from './ModalConfig'
import { getContainer } from '@/functions/dom/Container'
import { createVNode, type FunctionalComponent, ref, render } from 'vue'
import Modal from './Modal.vue'

export function useModal(Component: FunctionalComponent, props?: ModalProps) {
  const _show = ref(false)

  const show = () => {
    if (!_show.value) {
      _show.value = true
    }
  }

  const hide = () => {
    if (_show.value) {
      _show.value = false
    }
  }

  const modal = () => (
    <Modal
      modelValue={_show.value}
      persistent={props?.persistent}
      width={props?.width}
    >
      <Component />
    </Modal>
  )

  const node = createVNode(modal)
  const container = getContainer('_models_container_')
  if (container && node) {
    render(node, container)
  }

  return { show, hide }
}
