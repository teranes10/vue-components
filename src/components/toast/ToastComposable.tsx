import { useNotification } from "../notification/NotificationComposable";
import type {
  NotificationGravity,
  NotificationPosition,
} from "../notification/NotificationConfig";
import type { ToastType } from "./ToastConfig";
import Toast from "./Toast.vue";

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  gravity?: NotificationGravity;
  position?: NotificationPosition;
  stopOnFocus?: boolean;
}

export function useToast(
  message: string,
  {
    type = "success",
    duration = 2500,
    gravity = "top",
    position = "right",
    stopOnFocus = true,
  }: ToastOptions = {}
) {
  const component = () => <Toast text={message} type={type} close={close} />;

  const notification = useNotification(component, {
    duration,
    gravity,
    position,
    stopOnFocus,
  });

  function close() {
    notification.hide();
  }
}
