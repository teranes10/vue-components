import type { ComponentType } from '@teranes/vue-composables'
import type { NotificationProps } from './NotificationConfig'
import { getContainer } from '@/functions/dom/Container'
import { createVNode, type FunctionalComponent, ref, render } from 'vue'
import Notification from './Notification.vue'

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
  const container = getContainer('_notifications_container_')
  if (container && node) {
    render(node, container)
  }

  return { show, hide }
}
