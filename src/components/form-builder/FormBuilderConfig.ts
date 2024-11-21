import styles from "./FormBuilder.module.css"
export interface FormBuilderProps<T> {
  label?: string
  group?: string
  modelValue: T
}

export type FormBuilderEmits<T> = {
  'update:modelValue': [value: T]
}

export const FormBuilderContextKey = 'FormBuilderContextKey'

export interface FormBuilderContext {
  userEditedFields: Set<string>
  propsToWatch: FormBuilderPropsToWatch
  onValueUpdate: (fieldName: string, value: any, programmaticallyChanged?: boolean) => void
  setPropsToWatch: (propsToWatch: FormBuilderPropsToWatch) => void
}

export interface FormBuilderPropsToWatch {
  [propToWatch: string]: FormBuilderWatcher[]
}

export interface FormBuilderWatcher {
  watcherProp: string
  setter: (item: any) => any
  disableWatcherAfterUserEdit: boolean
  userChangesOnly: boolean
}

export type FormFieldSize =
  | {
    sm: FormFieldSizeValue
    md: FormFieldSizeValue
    lg: FormFieldSizeValue
  }
  | FormFieldSizeValue

export type FormFieldSizeValue =
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

export const SmFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
  1: styles.smColSpan1,
  2: styles.smColSpan2,
  3: styles.smColSpan3,
  4: styles.smColSpan4,
  5: styles.smColSpan5,
  6: styles.smColSpan6,
  7: styles.smColSpan7,
  8: styles.smColSpan8,
  9: styles.smColSpan9,
  10: styles.smColSpan10,
  11: styles.smColSpan11,
  12: styles.smColSpan12,
}

export const MdFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
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

export const LgFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
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

export interface FieldAttrs {
  size?: FormFieldSize
  class?: string
}
