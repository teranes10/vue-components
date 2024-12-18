import { getAccessedProps } from '@teranes/utils'
import styles from './FormBuilder.module.css'

export type FormBuilderProps<T> = {
  label?: string
  group?: string
  modelValue: T
}

export type FormBuilderEmits<T> = {
  'update:modelValue': [value: T]
}

export type FormBuilderContext = {
  userEditedFields: Set<string>
  propsToWatch: FormBuilderPropsToWatch
  onValueUpdate: (fieldName: string, value: any, programmaticallyChanged?: boolean) => void
  setPropsToWatch: (propsToWatch: FormBuilderPropsToWatch) => void
}

type FormBuilderPropsToWatch = {
  [propToWatch: string]: FormBuilderWatcher[]
}

type FormBuilderWatcher = {
  watcherProp: string
  setter: (item: any) => any
  disableWatcherAfterUserEdit: boolean
  userChangesOnly: boolean
}

type FormFieldSizeValue =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12

type FormFieldSize =
  | {
    sm: FormFieldSizeValue
    md: FormFieldSizeValue
    lg: FormFieldSizeValue
  }
  | FormFieldSizeValue

export type FieldAttrs = {
  size?: FormFieldSize
  class?: string
}

export const FormBuilderContextKey = 'FormBuilderContextKey'

const SmFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
  1: styles.colSpan1,
  2: styles.colSpan2,
  3: styles.colSpan3,
  4: styles.colSpan4,
  5: styles.colSpan5,
  6: styles.colSpan6,
  7: styles.colSpan7,
  8: styles.colSpan8,
  9: styles.colSpan9,
  10: styles.colSpan10,
  11: styles.colSpan11,
  12: styles.colSpan12,
}

const MdFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
  1: styles.mdColSpan1,
  2: styles.mdColSpan2,
  3: styles.mdColSpan3,
  4: styles.mdColSpan4,
  5: styles.mdColSpan5,
  6: styles.mdColSpan6,
  7: styles.mdColSpan7,
  8: styles.mdColSpan8,
  9: styles.mdColSpan9,
  10: styles.mdColSpan10,
  11: styles.mdColSpan11,
  12: styles.mdColSpan12,
}

const LgFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
  1: styles.lgColSpan1,
  2: styles.lgColSpan2,
  3: styles.lgColSpan3,
  4: styles.lgColSpan4,
  5: styles.lgColSpan5,
  6: styles.lgColSpan6,
  7: styles.lgColSpan7,
  8: styles.lgColSpan8,
  9: styles.lgColSpan9,
  10: styles.lgColSpan10,
  11: styles.lgColSpan11,
  12: styles.lgColSpan12,
}

function getSizeClass(size?: FormFieldSize) {
  if (size && typeof size === 'object') {
    return {
      [SmFormFieldSizeClasses[size.sm || 12]]: true,
      [MdFormFieldSizeClasses[size.md || 12]]: size.md,
      [LgFormFieldSizeClasses[size.lg || 12]]: size.lg,
    }
  }

  return {
    [SmFormFieldSizeClasses[12]]: true,
    [MdFormFieldSizeClasses[size!]]: !!size,
  }
}

export function getFieldClasses(attrs?: FieldAttrs) {
  return [getSizeClass(attrs?.size), attrs?.class || '']
}

export function getPropsToWatch(fields: any[], group?: string) {
  const propsToWatch: FormBuilderPropsToWatch = {}
  const watcherProps = fields?.filter((field: any) => !!field.watcher)

  for (const watcherProp of watcherProps) {
    const { setter, disableWatcherAfterUserEdit, userChangesOnly } = watcherProp.watcher
    const parameterProps = getAccessedProps(setter.toString())
    const itemProps = Object.values(parameterProps)?.[0]

    for (const prop of itemProps) {
      if (!propsToWatch[prop]) {
        propsToWatch[prop] = []
      }

      propsToWatch[prop].push({ watcherProp: (group ? `${group}.${watcherProp.name}` : watcherProp.name), setter, disableWatcherAfterUserEdit, userChangesOnly })
    }
  }

  return propsToWatch
}
