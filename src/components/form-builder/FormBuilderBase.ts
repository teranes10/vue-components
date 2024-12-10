import type { ElementsProps } from '@/components/element'
import type { InputsProps } from '@/components/input'
import type { FieldAttrs } from './FormBuilderConfig'
import { isObject } from '@teranes/utils'
import { type Component, isProxy, toRaw } from 'vue'
import { MetaKeyPrefix } from './FormBuilderAnnotations'
import 'reflect-metadata'

export abstract class FormBuilderBase<T = object> {
  public _item?: T

  constructor(group?: any) {
    this._item = getItem(group) || this
  }

  getAttributes(): Attribute[] {
    const prototypeProps = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
    const instanceProps = Object.getOwnPropertyNames(this)

    return [...prototypeProps, ...instanceProps]
      .filter(prop => !['_item', 'constructor', 'onValueChanged'].includes(prop))
      .map(prop => createAttribute(this, prop))
      .filter(Boolean)
  }

  getValue() {
    const mapObject = (obj: any): any => {
      return Object.entries(obj)
        .filter(([key]) => key !== '_item')
        .reduce((acc, [key, value]) => {
          acc[key] = isObject(value) ? mapObject(value) : (isProxy(value) ? toRaw(value) : value)
          return acc
        }, {} as any)
    }

    return mapObject(this)
  }

  onValueChanged(_path: string, _value: any) {

  }
}

function createAttribute(obj: any, prop: string): any | undefined {
  const value = obj[prop]
  const decorators = getDecorators(obj, prop) as any

  const commonAttrs = { showIf: decorators.showIf }

  if ('group' in decorators) {
    if (value !== value?._item) {
      console.error('SubForm instances should be initialized with the parent form as an argument.')
    }

    return {
      _type: 'group',
      name: prop,
      value,
      ...decorators.group,
      ...commonAttrs,
    }
  }

  if ('component' in decorators) {
    return {
      _type: 'component',
      name: prop,
      value,
      ...decorators.component,
      ...commonAttrs,
    }
  }

  if ('input' in decorators) {
    return {
      _type: 'input',
      name: prop,
      value,
      ...decorators.input,
      watcher: decorators.watcher,
      ...commonAttrs,
    }
  }

  return undefined
}

function getDecorators(target: object, property: string): Record<string, any> {
  const metadataKeys = Reflect.getMetadataKeys(target, property)
    .filter((key: string) => key.startsWith(MetaKeyPrefix))

  return metadataKeys.reduce((decorators, key) => {
    const keyType = key.split(':')[1]
    const metadata = Reflect.getMetadata(key, target, property)
    decorators[keyType] = metadata
    return decorators
  }, {} as Record<string, any>)
};

function getItem(group: any): any {
  while (group && group !== group?._item) {
    group = group._item
  }
  return group
};

export type FormBuilderObject<T> = {
  [K in keyof ClassObject<T> as K extends '_item' ? never : K]: T[K];
}

export type FormBuilderMapper<T> = (item: FormBuilderObject<T>) => void

export type Item<T extends FormBuilderBase> = Omit<
  NonNullable<T['_item']>,
  keyof FormBuilderBase
>

type ClassObject<T> = {
  [K in keyof T as T[K] extends ((...args: any[]) => any) ? never : K]: T[K];
}

interface AttributeCommon {
  name: string
  value: any
  showIf?: any
}

type GroupAttribute = AttributeCommon & {
  _type: 'group'
  attrs?: FieldAttrs
  label?: string
}

type ComponentAttribute = AttributeCommon & {
  _type: 'component'
  type: keyof ElementsProps | Component
  props?: Record<string, any>
  events?: Record<string, any>
  attrs?: FieldAttrs
}

type InputAttribute = AttributeCommon & {
  _type: 'input'
  type: keyof InputsProps
  props?: Record<string, any>
  watcher?: any
  attrs?: FieldAttrs
}

type Attribute = GroupAttribute | ComponentAttribute | InputAttribute
