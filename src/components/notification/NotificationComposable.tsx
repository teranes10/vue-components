import { createVNode, render, ref, type FunctionalComponent } from 'vue'
import type { ComponentType } from '@teranes/vue-composables'
import Notification from './Notification.vue'
import { type NotificationProps } from './NotificationConfig'

export function useNotification(
  Component: FunctionalComponent,
  {
    duration = 3000,
    gravity = 'top',
    position = 'right',
    stopOnFocus = true,
    autoShow = true,
  }: NotificationProps = {},
) {
  const notificationComponent = ref<ComponentType<typeof Notification>>()

  const notification = () => (
    <Notification
      ref={notificationComponent}
      duration={duration}
      gravity={gravity}
      position={position}
      stopOnFocus={stopOnFocus}
      autoShow={autoShow}
    >
      {() => <Component />}
    </Notification>
  )

  const show = () => {
    if (notificationComponent.value) {
      notificationComponent.value.show()
    }
  }

  const hide = () => {
    if (notificationComponent.value) {
      notificationComponent.value.hide()
    }
  }

  const node = createVNode(notification)
  const container = NotificationContainer()
  if (container && node) {
    render(node, container)
  }

  return { show, hide }
}

const NotificationContainer = (): HTMLElement | undefined => {
  if (document) {
    let container = document.getElementById('notifications')
    if (!container) {
      container = document.createElement('div')
      container.id = 'notifications'
      document.getElementById('app')?.append(container)
    }

    return container
  }

  return undefined
}
