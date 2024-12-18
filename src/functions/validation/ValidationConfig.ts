import type { Ref } from 'vue'

export type ValidationRule<T> = (value: T) => string | boolean

export type ValidationProps<T> = {
  rules?: ValidationRule<T>[]
}

export type ValidationCallback = (messages?: string[]) => void

export type ValidationOptions<T> = {
  rules: ValidationRule<T>[]
  inputElement?: HTMLInputElement
  inputContainer?: HTMLElement
  errorsListElement?: HTMLUListElement
  value?: Ref<T | undefined>
  cb?: ValidationCallback
}

export const ValidationFormContextKey = 'ValidationFormContextKey'
export const ValidationFieldIdAttribute = 'validation-id'

export type ValidationFieldContext = {
  fieldId: string
  isError: Ref<boolean>
  validate: (cb?: ValidationCallback) => Promise<boolean>
}

export type ValidationFormContext = {
  onFieldInitialize: <T>(options: ValidationOptions<T>) => ValidationFieldContext
}

export type ValidationForm = {
  getFields: () => Map<string, ValidationFieldContext>
  validate: () => Promise<boolean>
}
