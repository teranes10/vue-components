import { createVNode, render, ref, type FunctionalComponent } from "vue";
import Modal from "./Modal.vue";
import type { ModalProps } from "./ModalConfig";

export function useModal(Component: FunctionalComponent, props?: ModalProps) {
  const _show = ref(false);

  const show = () => {
    if (!_show.value) {
      _show.value = true;
    }
  };

  const hide = () => {
    if (_show.value) {
      _show.value = false;
    }
  };

  const modal = () => (
    <Modal
      modelValue={_show.value}
      persistent={props?.persistent}
      width={props?.width}
    >
      <Component />
    </Modal>
  );

  const node = createVNode(modal);
  const container = ModalsContainer();
  if (container && node) {
    render(node, container);
  }

  return { show, hide };
}

const ModalsContainer = (): HTMLElement | undefined => {
  if (document) {
    let container = document.getElementById("modals");
    if (!container) {
      container = document.createElement("div");
      container.id = "modals";
      document.getElementById("app")?.append(container);
    }

    return container;
  }

  return undefined;
};
