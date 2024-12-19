import type { ComponentType } from '@teranes/vue-composables'
import type { NotificationProps } from './NotificationConfig'
import { vRender } from '@/functions/dom/Container'
import { type FunctionalComponent, nextTick, ref } from 'vue'
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

  const { remove } = vRender('_notifications_container_', () => (
    <Notification
      ref={notificationComponent}
      duration={duration}
      gravity={gravity}
      position={position}
      stopOnFocus={stopOnFocus}
      autoShow={autoShow}
      onHide={() => remove()}
    >
      {() => <Component />}
    </Notification>
  ))

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

  return { show, hide }
}
