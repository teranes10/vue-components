import type { Key } from '@/functions/item/ItemKey'
import type { Merge } from '@teranes/utils'
import type { Attrs, ComponentEvents as ExtractComponentEvents, ComponentProps as ExtractComponentProps } from '@teranes/vue-composables'
import { Accordion, type AccordionEmits, type AccordionProps } from '@/components/accordion'

import { Button, type ButtonEmits, type ButtonProps } from '@/components/button'
import { Chip, type ChipEmits, type ChipProps } from '@/components/chip'
import { DataTable, type DataTableEmits, type DataTableProps } from '@/components/data-table'
import { Image, type ImageEmits, type ImageProps } from '@/components/image'
import { inputs, type InputsProps } from '@/components/input'
import { Loading, type LoadingEmits, type LoadingProps } from '@/components/loading'
import { ProgressBar, type ProgressBarEmits, type ProgressBarProps } from '@/components/progress-bar'
import { Table, type TableEmits, type TableProps } from '@/components/table'
import { Tabs, type TabsEmits, type TabsProps } from '@/components/tabs'
import { type Component, isVNode } from 'vue'

export type ElementsProps = {
  'accordion': Attrs<AccordionProps, AccordionEmits>
  'button': Attrs<ButtonProps, ButtonEmits>
  'chip': Attrs<ChipProps, ChipEmits>
  'data-table': Attrs<DataTableProps<unknown, Key>, DataTableEmits<unknown, Key>>
  'image': Attrs<ImageProps, ImageEmits>
  'loading': Attrs<LoadingProps, LoadingEmits>
  'progress-bar': Attrs<ProgressBarProps, ProgressBarEmits>
  'table': Attrs<TableProps<unknown, Key>, TableEmits<unknown, unknown>>
  'tabs': Attrs<TabsProps, TabsEmits>
} & InputsProps

export const elements: Record<keyof ElementsProps, Component> = {
  ...inputs,
  'accordion': Accordion,
  'button': Button,
  'chip': Chip,
  'data-table': DataTable,
  'image': Image,
  'loading': Loading,
  'progress-bar': ProgressBar,
  'table': Table,
  'tabs': Tabs,
}

export type ElementProps<T extends (keyof ElementsProps | Component)> = {
  type: T
  props: T extends keyof ElementsProps ? ElementsProps[T] : ReplaceUnknownWithAny<Merge<ExtractComponentProps<T>, ExtractComponentEvents<T>>>
}

export function isComponent(value: unknown): value is Component {
  return isVNode(value)
}
