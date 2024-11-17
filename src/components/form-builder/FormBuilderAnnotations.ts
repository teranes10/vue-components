import 'reflect-metadata'
import type { InputComponentProps } from '@/components/input-widget'
import type { ValidationRule } from '@/functions/validation/ValidationConfig'
import type { FormBuilderBase, Item } from './FormBuilderBase'
import type { FieldAttrs } from './FormBuilderConfig'

export const MetaKeyPrefix = 'form-builder'

export function fieldProps<T extends keyof InputComponentProps>(
  type: T,
  props: InputComponentProps[T],
  attrs?: FieldAttrs,
) {
  return function (target: any, property: string) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:props`,
      { type, props, attrs },
      target,
      property,
    )
  }
}

export function fieldComponent<T extends keyof InputComponentProps, K extends keyof EventsOnly<InputComponentProps[T]>>(
  type: T,
  props: InputComponentProps[T],
  attrs?: FieldAttrs,
  ...events: K[]
) {
  return function (target: any, property: string) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:_component`,
      { type, props, events, attrs },
      target,
      property,
    )
  }
}

export function fieldShowIf<T extends FormBuilderBase, K extends keyof T>(
  cb: (item: NonNullable<T['_item']>) => boolean,
) {
  return function (target: T, property: K) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:showIf`,
      cb,
      target,
      property as string,
    )
  }
}

export function fieldWatcher<T extends FormBuilderBase, K extends keyof T>(
  setter: (item: Item<T>) => T[K],
  disableWatcherAfterUserEdit: boolean = false,
  userChangesOnly: boolean = false,
) {
  return function (target: T, property: K) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:watcher`,
      { setter, disableWatcherAfterUserEdit, userChangesOnly },
      target,
      property as string,
    )
  }
}

export function fieldRules<T extends FormBuilderBase, K extends keyof T>(
  ...rules: ValidationRule<T[K]>[]
) {
  return function (target: T, property: K) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:rules`,
      rules,
      target,
      property as string,
    )
  }
}

export function formGroup<T extends FormBuilderBase, K extends keyof T>(
  label: string,
  attrs?: FieldAttrs,
) {
  return function (target: T, property: K) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:group`,
      { label, attrs },
      target,
      property as string,
    )
  }
}

type EventsOnly<T> = {
  [K in keyof T as K extends `on${string}` ? K : never]: T[K]
}
