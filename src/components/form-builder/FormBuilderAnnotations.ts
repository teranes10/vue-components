import 'reflect-metadata'
import type { InputsProps, InputProps } from '@/components/input'
import type { ComponentProps, ComponentsProps } from '@/components/component'
import type { FormBuilderBase, Item } from './FormBuilderBase'
import type { FieldAttrs } from './FormBuilderConfig'
import { Component } from 'vue'

export const MetaKeyPrefix = 'form-builder'

export function fieldProps<T extends keyof InputsProps>(
  type: InputProps<T>['type'],
  props: InputProps<T>['props'],
  attrs?: FieldAttrs,
) {
  return function (target: any, property: string) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:input`,
      { type, props, attrs },
      target,
      property,
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

export function fieldComponent<T extends keyof ComponentsProps | Component>(
  type: ComponentProps<T>['type'],
  props: ComponentProps<T>['props'],
  attrs?: FieldAttrs,
  ...events: (keyof EventsOnly<ComponentProps<T>['props']>)[]
) {
  return function (target: any, property: string) {
    Reflect.defineMetadata(
      `${MetaKeyPrefix}:component`,
      { type, props, events, attrs },
      target,
      property,
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
