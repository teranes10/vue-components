import 'reflect-metadata'
import { isProxy, toRaw } from 'vue'
import { isObject } from '@teranes/utils'
import { MetaKeyPrefix } from './FormBuilderAnnotations'

export abstract class FormBuilderBase<T = object> {
  public _item?: T
  constructor(group?: any) {
    this._item = getItem(group) || this
  }

  getAttributes(): any[] {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(x => !['constructor', 'onValueChanged'].includes(x))
    const properties = Object.getOwnPropertyNames(this)

    return [...properties, ...methods]
      ?.filter(prop => prop !== '_item')
      ?.map((prop) => {
        const attrs: any = {
          name: prop,
          value: (this as any)[prop],
          ...getDecorators(this, prop),
        }

        if (Object.prototype.hasOwnProperty.call(attrs, 'group')) {
          console.assert(attrs?.value !== attrs?.value?._item, 'SubForm instances should be constructed with the parent form passed as an argument for proper initialization.')

          return {
            _type: 'group',
            label: attrs.group.label,
            attrs: attrs.group.attrs,
            name: attrs.name,
            value: attrs.value,
          }
        }
        else if (Object.prototype.hasOwnProperty.call(attrs, 'action')) {
          return {
            _type: 'button',
            name: attrs.name,
            props: attrs.action.props,
            attrs: attrs.action.attrs,
            onClick: attrs.action.onClick,
          }
        }
        else if (Object.prototype.hasOwnProperty.call(attrs, '_component')) {
          return {
            _type: 'component',
            name: attrs.name,
            value: attrs.value,
            type: attrs._component.type,
            props: attrs._component.props,
            events: attrs._component.events,
            attrs: attrs._component.attrs,
          }
        }
        else {
          if (attrs.type) {
            attrs._type = 'input'
          }
        }

        return attrs
      }).filter(x => !!x._type)
  }

  getValue() {
    function map(obj: any) {
      return Object.entries(obj).filter(([key]) => key !== '_item').reduce((obj: any, [key, value]) => {
        if (isObject(value)) {
          obj[key] = map(obj)
        }
        else {
          obj[key] = isProxy(value) ? toRaw(value) : value
        }

        return obj
      }, {})
    }

    return map(this)
  }

  onValueChanged(_path: string, _value: any) {

  }
}

const getDecorators = (target: object, property: string): string[] => {
  const metaDataKeys = Reflect.getMetadataKeys(target, property)
    ?.filter(key => key.toString().startsWith(MetaKeyPrefix))

  return metaDataKeys?.reduce((values, key) => {
    const keyType = key.split(':')[1]
    const metaData = Reflect.getMetadata(key, target, property)

    if (keyType === 'props') {
      const { attrs, props, type } = metaData
      return { ...values, attrs, type, props: { ...(values.props && values.props), ...props } }
    }
    else if (keyType === 'rules') {
      return { ...values, props: { ...(values.props && values.props), rules: metaData } }
    }
    else {
      return { ...values, ...{ [keyType]: metaData } }
    }
  }, {})
}

const getItem = (group: any): any => {
  if (group !== group?._item) {
    return getItem(group._item)
  }

  return group
}

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
