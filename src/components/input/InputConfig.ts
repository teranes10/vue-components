import { type Component } from 'vue'
import { Attrs } from '@teranes/vue-composables'
import { Checkbox, CheckboxEmits, CheckboxGroup, CheckboxGroupEmits, CheckboxGroupProps, CheckboxProps } from '@/components/checkbox'
import { RadioButton, RadioButtonEmits, RadioButtonProps, RadioGroup, RadioGroupEmits, RadioGroupProps } from '@/components/radio-button'
import { Switch, SwitchEmits, SwitchProps } from '@/components/switch'
import { DatePicker, DatePickerEmits, DatePickerProps } from '@/components/date-picker'
import { TextField, TextFieldEmits, TextFieldProps } from '@/components/text-field'
import { Select, SelectEmits, SelectProps } from '@/components/select'
import { Autocomplete, AutocompleteEmits, AutocompleteProps } from '@/components/autocomplete'
import { NumberField, NumberFieldEmits, NumberFieldProps } from '@/components/number-field'
import { CurrencyField, CurrencyFieldEmits, CurrencyFieldProps } from '@/components/currency-field'
import { FileUpload, FileUploadEmits, FileUploadProps } from '@/components/file-upload'

export interface InputsProps {
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

export const inputs: Record<keyof InputsProps, Component> = {
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

export interface InputProps<T extends keyof InputsProps> {
  type: T
  props: InputsProps[T]
}
