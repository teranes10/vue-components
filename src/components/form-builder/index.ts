export type { FormBuilderProps, FormBuilderEmits } from './FormBuilderConfig'
export { formGroup, fieldProps, fieldRules, fieldShowIf, fieldWatcher, fieldComponent } from './FormBuilderAnnotations'
export { FormBuilderBase } from './FormBuilderBase'

export type { FormBuilderModalProps, FormBuilderModalEmits, FormBuilderModalContext } from './components/form-builder-modal/FormBuilderModelConfig'
export { FormBuilderModalInitializer as useFormBuilderModalInitializer } from './components/form-builder-modal/FormBuilderModelConfig'
export { useFormFieldView } from './components/form-field/FormFieldComposable'

export { default as FormBuilderModal } from './components/form-builder-modal/FormBuilderModal.vue'
export { default as FormBuilder } from './FormBuilder.vue'
