import type { ErDiagramColumnProps } from '../er-diagram-column/ErDiagramColumnConfig'

export interface ErDiagramEntityProps {
  name: string
  columns?: ErDiagramColumnProps[]
}
