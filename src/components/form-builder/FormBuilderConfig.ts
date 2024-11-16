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
  1: 'sm:col-span-1',
  2: 'sm:col-span-2',
  3: 'sm:col-span-3',
  4: 'sm:col-span-4',
  5: 'sm:col-span-5',
  6: 'sm:col-span-6',
  7: 'sm:col-span-7',
  8: 'sm:col-span-8',
  9: 'sm:col-span-9',
  10: 'sm:col-span-10',
  11: 'sm:col-span-11',
  12: 'sm:col-span-12',
}

export const MdFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
}

export const LgFormFieldSizeClasses: Record<FormFieldSizeValue, string> = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  5: 'lg:col-span-5',
  6: 'lg:col-span-6',
  7: 'lg:col-span-7',
  8: 'lg:col-span-8',
  9: 'lg:col-span-9',
  10: 'lg:col-span-10',
  11: 'lg:col-span-11',
  12: 'lg:col-span-12',
}

export interface FieldAttrs {
  size?: FormFieldSize
  class?: string
}
