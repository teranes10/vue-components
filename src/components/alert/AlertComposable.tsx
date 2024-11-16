import { ArchiveXIcon, ArchiveRestoreIcon, Trash2Icon } from 'lucide-vue-next'

import { useModal } from '../modal/ModalComposable'
import Alert from './Alert.vue'
import type { AlertProps } from './AlertConfig'

export function useAlert(options: AlertProps) {
  const props: AlertProps = {
    ...options,
    confirmButton: options.confirmButton
      ? {
          ...options.confirmButton,
          onClick: () => {
            modal.hide()
            options.confirmButton?.onClick?.()
          },
        }
      : undefined,
    closeButton: {
      ...options.closeButton,
      text:
        options.closeButton?.text ?? options.confirmButton ? 'Cancel' : 'Ok',
      onClick: () => {
        modal.hide()
        options.closeButton?.onClick?.()
      },
    },
  }

  const component = () => (
    <Alert
      title={props.title}
      text={props.text}
      icon={props.icon}
      type={props.type}
      confirmButton={props.confirmButton}
      closeButton={props.closeButton}
    />
  )

  const modal = useModal(component, { width: 450 })
  modal.show()
}

export function useArchiveAlert(
  onConfirm: () => void,
  options?: { name?: string },
) {
  const message = options?.name
    ? `<span style="font-weight: 600">${options.name}</span>`
    : 'this item'

  useAlert({
    title: 'Are you sure?',
    text: `Do you really want to archive ${message}?`,
    icon: ArchiveXIcon,
    type: 'danger',
    confirmButton: {
      text: 'Archive',
      onClick: onConfirm,
    },
  })
}

export function useRestoreAlert(
  onConfirm: () => void,
  options?: { name?: string },
) {
  const message = options?.name
    ? `<span style="font-weight: 600">${options.name}</span>`
    : 'this item'

  useAlert({
    title: 'Are you sure?',
    text: `Do you really want to restore ${message}?`,
    icon: ArchiveRestoreIcon,
    type: 'info',
    confirmButton: {
      text: 'Restore',
      onClick: onConfirm,
    },
  })
}

export function useDeleteAlert(
  onConfirm: () => void,
  options?: { name?: string },
) {
  const message = options?.name
    ? `<span style="font-weight: 600">${options.name}</span>`
    : 'this item'

  useAlert({
    title: 'Are you sure?',
    text: `Do you really want to delete ${message}?`,
    icon: Trash2Icon,
    type: 'danger',
    confirmButton: {
      text: 'Delete',
      onClick: onConfirm,
    },
  })
}
