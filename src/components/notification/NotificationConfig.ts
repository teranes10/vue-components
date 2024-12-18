export type NotificationGravity = 'top' | 'bottom'
export type NotificationPosition = 'left' | 'center' | 'right'

export type NotificationProps = {
  duration?: number
  gravity?: NotificationGravity
  position?: NotificationPosition
  stopOnFocus?: boolean
  autoShow?: boolean
}
