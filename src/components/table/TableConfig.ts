import type { BaseInternalItem } from '@/functions/item/BaseInternalItem'
import type { ItemComponent } from '@/functions/item/ItemComponent'
import type { ItemKey, Key } from '@/functions/item/ItemKey'
import type { ItemValue } from '@/functions/item/ItemValue'
import type { Component, CSSProperties } from 'vue'

export type TableProps<T, K extends Key> = {
  headers?: TableHeader<T, K>[]
  items?: T[]
  itemKey?: ItemKey<T, K>
  mobileView?: boolean | number
  cardWidth?: number | string
  resizable?: boolean
  onSelect?: (key: K, select: boolean, item: T) => void
  onSelectAll?: (keys: K[], select: boolean, items: T[]) => void
  onExpand?: (key: K, expand: boolean, item: T) => void
} & Selectable<K> & Expandable<K>

export type Selectable<K> = {
  selectable?: boolean
} & (SingleSelect<K> | MultipleSelect<K>)

type SingleSelect<K> = {
  singleSelect?: true
  selected?: K
}

type MultipleSelect<K> = {
  singleSelect?: false
  selected?: K[]
}

export type Expandable<K> = {
  expandable?: boolean
} & (SingleExpand<K> | MultipleExpand<K>)

type SingleExpand<K> = {
  singleExpand?: true
  expanded?: K
}

type MultipleExpand<K> = {
  singleExpand?: false
  expanded?: K[]
}

export type TableEmits<T, K extends Key> = {
  'update:headers': [value: TableHeader<T, K>[]]
  'update:items': [value: T[]]
  'update:selected': [value: K | K[]]
  'update:expanded': [value: K | K[]]
}

export type TableInternalItem<T, K extends Key> = BaseInternalItem<T, K> & {
  selected: boolean
  expanded: boolean
}

export type TableHeader<T, K extends Key> = {
  text: string
  value?: ItemValue<T, K, TableInternalItem<T, K>>
  component?: ItemComponent<T, K, TableInternalItem<T, K>>
  headerComponent?: Component
  class?: string
  cardClass?: string
  minWidth?: string | number
  width?: string | number
  maxWidth?: string | number
  align?: 'left' | 'right' | 'center'
  style?: CSSProperties
  resizable?: boolean
}

export type TableInternalHeader<T, K extends Key, H = TableHeader<T, K>> = Omit<H, 'text' | 'value' | 'component' | 'headerComponent'> & {
  _header: TableHeader<T, K>
  key: Key
  text: TableInternalHeaderText
  value: TableInternalHeaderValue<T, K>
  headerElement?: HTMLTableCellElement
  getWidth: () => number | undefined
  addClass: (v: string) => void
  removeClass: (v: string) => void
}

export type TableInternalHeaderText =
  | { type: 'slot', name: string }
  | { type: 'component', component: Component }
  | { type: 'text', text: string }
  | { type: 'unknown' }

export type TableInternalHeaderValue<T, K extends Key> =
  | { type: 'slot', name: string }
  | { type: 'component', component: (item: TableInternalItem<T, K>) => Component | undefined }
  | { type: 'text', text: (item: TableInternalItem<T, K>) => any }
  | { type: 'unknown' }

export type MouseMoveResult = {
  w: number
  h: number
  startX: number
  startY: number
  offsetX: number
  offsetY: number
  clientX: number
  clientY: number
  x: number
  y: number
  init: boolean
}

export type MouseMoveOptions = {
  handleElement?: HTMLElement
  containerElement?: HTMLElement
  omitOffset?: boolean
  padding?: any
  callback?: (o: MouseMoveResult) => void
}

export function parseCssValue(input: string): any {
  const match = input.match(/^(-?\d+)(px|rem)?$/)
  if (!match) {
    throw new Error(`Invalid input: "${input}". Must be a number optionally followed by "px" or "rem".`)
  }

  const value = Number.parseInt(match[1], 10)
  const unit = (match[2] || '') as any

  return { value, unit }
}

export function extractCssBoxValue(value: any): any {
  const paddingValues = value.split(' ').map(value => parseCssValue(value))

  switch (paddingValues.length) {
    case 1:
      paddingValues[1] = paddingValues[2] = paddingValues[3] = paddingValues[0]
      break
    case 2:
      paddingValues[2] = paddingValues[0]
      paddingValues[3] = paddingValues[1]
      break
    case 3:
      paddingValues[3] = paddingValues[1]
      break
  }

  return {
    top: paddingValues[0],
    right: paddingValues[1],
    bottom: paddingValues[2],
    left: paddingValues[3],
  }
}

export function mouseMoveListener(element: HTMLElement, { handleElement, containerElement, padding = '10', omitOffset = false, callback }: MouseMoveOptions = {}) {
  const _handleElement = handleElement || element
  const _containerElement = containerElement || document.documentElement

  const { top, left, right, bottom } = extractCssBoxValue(padding)

  let startX = 0
  let startY = 0
  let offsetX = 0
  let offsetY = 0
  let w = 0
  let h = 0
  let minX = 0
  let minY = 0
  let maxX = 0
  let maxY = 0

  function getClientCoordinates(e: MouseEvent | TouchEvent) {
    if (e instanceof TouchEvent) {
      const touch = e.touches[0]
      return { clientX: touch.clientX, clientY: touch.clientY }
    }

    return { clientX: e.clientX, clientY: e.clientY }
  }

  function updateBoundaries(x: number, y: number, omitOffset: boolean) {
    startX = x
    startY = y

    const rect = element.getBoundingClientRect()
    offsetX = startX - rect.left
    offsetY = startY - rect.top

    w = rect.width
    h = rect.height

    const containerRect = _containerElement.getBoundingClientRect()

    minX = containerRect.left + left.value + (omitOffset ? 0 : offsetX)
    minY = containerRect.top + top.value + (omitOffset ? 0 : offsetY)
    maxX = containerRect.right - right.value - (omitOffset ? 0 : w - offsetX)
    maxY = containerRect.bottom - bottom.value - (omitOffset ? 0 : h - offsetY)
  }

  function calculatePosition(x: number, y: number, omitOffset: boolean) {
    return {
      x: Math.max(minX, Math.min(x, maxX)) - (omitOffset ? 0 : offsetX),
      y: Math.max(minY, Math.min(y, maxY)) - (omitOffset ? 0 : offsetY),
    }
  }

  function getResultObject(clientX: number, clientY: number, x: number, y: number, init: boolean): MouseMoveResult {
    return { w, h, startX, startY, offsetX, offsetY, clientX, clientY, x, y, init }
  }

  // validate initial position
  updateBoundaries(0, 0, true)
  const rect = element.getBoundingClientRect()
  const { x, y } = calculatePosition(rect.left, rect.top, true)
  callback?.(getResultObject(rect.left, rect.top, x, y, true))

  _handleElement.addEventListener('mousedown', moveStart)
  _handleElement.addEventListener('touchstart', moveStart, { passive: false })

  function moveStart(e: MouseEvent | TouchEvent) {
    e.preventDefault()

    const { clientX, clientY } = getClientCoordinates(e)
    updateBoundaries(clientX, clientY, omitOffset)

    document.documentElement.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('touchmove', onMove, { passive: false })
    document.documentElement.addEventListener('mouseup', moveEnd)
    document.documentElement.addEventListener('touchend', moveEnd)
  }

  function onMove(e: MouseEvent | TouchEvent) {
    e.preventDefault()

    const { clientX, clientY } = getClientCoordinates(e)
    const { x, y } = calculatePosition(clientX, clientY, omitOffset)

    callback?.(getResultObject(clientX, clientY, x, y, false))
  }

  function moveEnd() {
    document.documentElement.removeEventListener('mousemove', onMove)
    document.documentElement.removeEventListener('touchmove', onMove)
    document.documentElement.removeEventListener('mouseup', moveEnd)
    document.documentElement.removeEventListener('touchend', moveEnd)
  }

  function clear() {
    _handleElement.removeEventListener('mousedown', moveStart)
    _handleElement.removeEventListener('touchstart', moveStart)
  }

  return { clear }
}

export function useResizeColumn(resizableElement: HTMLElement, handleElement: HTMLElement, cb: (o: any) => void) {
  handleElement.addEventListener('mousedown', resizeStart)
  handleElement.addEventListener('touchstart', resizeStart, { passive: false })

  let _x: number, _y: number, _w: number, _h: number

  function resizeStart(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    _x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
    _y = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY
    _w = Number.parseInt(document.defaultView!.getComputedStyle(resizableElement).width, 10)
    _h = Number.parseInt(document.defaultView!.getComputedStyle(resizableElement).height, 10)

    document.documentElement.addEventListener('mousemove', onResize)
    document.documentElement.addEventListener('touchmove', onResize, { passive: false })
    document.documentElement.addEventListener('mouseup', resizeEnd)
    document.documentElement.addEventListener('touchend', resizeEnd)
  }

  function resizeEnd() {
    document.documentElement.removeEventListener('mousemove', onResize)
    document.documentElement.removeEventListener('touchmove', onResize)
    document.documentElement.removeEventListener('mouseup', resizeEnd)
    document.documentElement.removeEventListener('touchend', resizeEnd)
  }

  function onResize(e: MouseEvent | TouchEvent) {
    e.preventDefault()

    const clientX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
    const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY

    const x = clientX - _x
    const y = clientY - _y

    const w = _w + x
    const h = _h + y

    cb({
      x,
      y,
      w,
      h,
      _x,
      _y,
      _w,
      _h,
    })
  }
}
