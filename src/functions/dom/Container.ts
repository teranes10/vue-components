export function getContainer(id: string): HTMLElement {
  if (!document) {
    throw new Error('document not found.')
  }

  let container = document.getElementById(id)
  if (!container) {
    container = document.createElement('div')
    container.id = id
    document.body?.append(container)
  }

  return container
}
