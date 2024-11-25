import { type Attrs, type ComponentProps as ExtractComponentProps, type ComponentEvents as ExtractComponentEvents } from "@teranes/vue-composables";
import { type Merge } from '@teranes/utils'
import { type Component } from "vue";

import { type InputsProps, inputs } from '@/components/input'
import { type AccordionProps, type AccordionEmits, Accordion } from "@/components/accordion";
import { type ButtonProps, type ButtonEmits, Button } from "@/components/button";
import { type ChipProps, ChipEmits, Chip } from "@/components/chip";
import { type DataTableProps, type DataTableEmits, DataTable } from "@/components/data-table";
import { type ImageProps, type ImageEmits, Image } from "@/components/image";
import { type LoadingProps, type LoadingEmits, Loading } from '@/components/loading'
import { type ProgressBarProps, type ProgressBarEmits, ProgressBar } from "@/components/progress-bar";
import { type TableProps, type TableEmits, Table } from "@/components/table";
import { type TabsProps, type TabsEmits, Tabs } from '@/components/tabs'

export interface ComponentsProps extends InputsProps {
    'accordion': Attrs<AccordionProps, AccordionEmits>
    'button': Attrs<ButtonProps, ButtonEmits>
    'chip': Attrs<ChipProps, ChipEmits>
    'data-table': Attrs<DataTableProps<unknown, unknown>, DataTableEmits<unknown, unknown>>
    'image': Attrs<ImageProps, ImageEmits>
    'loading': Attrs<LoadingProps, LoadingEmits>
    'progress-bar': Attrs<ProgressBarProps, ProgressBarEmits>
    'table': Attrs<TableProps<unknown, string | number>, TableEmits<unknown, unknown>>
    'tabs': Attrs<TabsProps, TabsEmits>
}

export const components: Record<keyof ComponentsProps, Component> = {
    ...inputs,
    'accordion': Accordion,
    'button': Button,
    'chip': Chip,
    'data-table': DataTable,
    'image': Image,
    'loading': Loading,
    'progress-bar': ProgressBar,
    'table': Table,
    'tabs': Tabs
}

export interface ComponentProps<T extends (keyof ComponentsProps | Component)> {
    type: T,
    props: T extends keyof ComponentsProps ? ComponentsProps[T] : ReplaceUnknownWithAny<Merge<ExtractComponentProps<T>, ExtractComponentEvents<T>>>;
}
