export type NotificationGravity = 'top' | 'bottom'
export type NotificationPosition = 'left' | 'center' | 'right'

export interface NotificationProps {
  duration?: number
  gravity?: NotificationGravity
  position?: NotificationPosition
  stopOnFocus?: boolean
  autoShow?: boolean
}
