import { type Component } from 'vue'
import { Attrs } from '@teranes/vue-composables'
import { Checkbox, CheckboxEmits, CheckboxGroup, CheckboxGroupEmits, CheckboxGroupProps, CheckboxProps } from '../checkbox'
import { RadioButton, RadioButtonEmits, RadioButtonProps, RadioGroup, RadioGroupEmits, RadioGroupProps } from '../radio-button'
import { Switch, SwitchEmits, SwitchProps } from '../switch'
import { DatePicker, DatePickerEmits, DatePickerProps } from '../date-picker'
import { TextField, TextFieldEmits, TextFieldProps } from '../text-field'
import { Select, SelectEmits, SelectProps } from '../select'
import { Autocomplete, AutocompleteEmits, AutocompleteProps } from '../autocomplete'
import { NumberField, NumberFieldEmits, NumberFieldProps } from '../number-field'
import { CurrencyField, CurrencyFieldEmits, CurrencyFieldProps } from '../currency-field'
import { FileUpload, FileUploadEmits, FileUploadProps } from '../file-upload'

export interface InputComponentProps {
  'checkbox-group': Attrs<CheckboxGroupProps<unknown>, CheckboxGroupEmits<unknown>>
  'checkbox': Attrs<CheckboxProps<unknown>, CheckboxEmits>
  'radio-group': Attrs<RadioGroupProps<unknown>, RadioGroupEmits<unknown>>
  'radio': Attrs<RadioButtonProps<unknown>, RadioButtonEmits>
  'switch': Attrs<SwitchProps, SwitchEmits>
  'date': Attrs<DatePickerProps, DatePickerEmits>
  'select': TextFieldProps & Attrs<SelectProps<unknown, unknown>, SelectEmits<unknown>>
  'autocomplete': TextFieldProps & SelectProps<unknown, unknown> & Attrs<AutocompleteProps<unknown>, AutocompleteEmits<unknown>>
  'text': Attrs<TextFieldProps, TextFieldEmits>
  'number': TextFieldProps & Attrs<NumberFieldProps, NumberFieldEmits>
  'currency': TextFieldProps & Attrs<CurrencyFieldProps, CurrencyFieldEmits>
  'file-upload': Attrs<FileUploadProps<unknown>, FileUploadEmits<unknown>>
}

export const inputComponents: Record<keyof InputComponentProps, Component> = {
  'checkbox-group': CheckboxGroup,
  'checkbox': Checkbox,
  'radio-group': RadioGroup,
  'radio': RadioButton,
  'switch': Switch,
  'date': DatePicker,
  'select': Select,
  'autocomplete': Autocomplete,
  'text': TextField,
  'number': NumberField,
  'currency': CurrencyField,
  'file-upload': FileUpload,
}

export interface InputWidgetProps<T extends keyof InputComponentProps> {
  type: T
  props: InputComponentProps[T]
}
