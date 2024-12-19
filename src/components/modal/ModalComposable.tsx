import type { ModalProps } from './ModalConfig'
import { vRender } from '@/functions/dom/Container'
import { type FunctionalComponent, ref } from 'vue'
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

  const { remove } = vRender('_models_container_', modal)

  return { show, hide, remove }
}
