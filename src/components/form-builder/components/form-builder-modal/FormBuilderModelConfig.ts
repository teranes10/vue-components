import type { FormBuilderBase, FormBuilderObject } from '../../FormBuilderBase'

export interface FormBuilderModalProps<T> {
  modelValue?: T
  show?: boolean
  label?: string
  width?: number
}
export type FormBuilderModalEmits<T> = {
  'update:modelValue': [value: T]
  'update:show': [value: boolean]
}
export type FormBuilderModalConfirm<T> = (editedItem: T) => void
export type FormBuilderModalSetter<T> = (input: FormBuilderObject<T>) => void
export interface ClassType<T extends object = object> { new(...args: any[]): T }
export interface FormBuilderModalContext<T extends FormBuilderBase> {
  create: (FormClass: ClassType<T>) => void
  assign: (map: (item: FormBuilderObject<T>) => void) => void
  reset: () => void
  open: (onConfirm?: FormBuilderModalConfirm<T>, map?: FormBuilderModalSetter<T>) => void
  close: () => void
}

export interface FormBuilderModalContextGetter<T extends FormBuilderBase> {
  ctx: () => FormBuilderModalContext<T> | undefined
}

export function FormBuilderModalInitializer<T extends FormBuilderBase>(
  FormClass: ClassType<T>,
): FormBuilderModalContextGetter<T> {
  let ctx: FormBuilderModalContext<T> | undefined = undefined
  const mounted = (_el: HTMLElement, _binding: any, vNode: any) => {
    ctx = vNode.ctx.exposed.ctx
    if (FormClass) {
      ctx?.create(FormClass)
    }
  }

  return { mounted, ctx: () => ctx } as FormBuilderModalContextGetter<T>
}
