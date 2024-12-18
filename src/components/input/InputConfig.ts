import type { AutocompleteEmits, AutocompleteProps } from '@/components/autocomplete'
import type { CheckboxEmits, CheckboxGroupEmits, CheckboxGroupProps, CheckboxProps } from '@/components/checkbox'
import type { CurrencyFieldEmits, CurrencyFieldProps } from '@/components/currency-field'
import type { DatePickerEmits, DatePickerProps } from '@/components/date-picker'
import type { FileUploadEmits, FileUploadProps } from '@/components/file-upload'
import type { NumberFieldEmits, NumberFieldProps } from '@/components/number-field'
import type { RadioButtonEmits, RadioButtonProps, RadioGroupEmits, RadioGroupProps } from '@/components/radio-button'
import type { SelectEmits, SelectProps } from '@/components/select'
import type { SwitchEmits, SwitchProps } from '@/components/switch'
import type { TextFieldEmits, TextFieldProps } from '@/components/text-field'
import type { Key } from '@/functions/item/ItemKey'
import type { Attrs } from '@teranes/vue-composables'
import type { Component } from 'vue'
import { Autocomplete } from '@/components/autocomplete'
import { Checkbox, CheckboxGroup } from '@/components/checkbox'
import { CurrencyField } from '@/components/currency-field'
import { DatePicker } from '@/components/date-picker'
import { FileUpload } from '@/components/file-upload'
import { NumberField } from '@/components/number-field'
import { RadioButton, RadioGroup } from '@/components/radio-button'
import { Select } from '@/components/select'
import { Switch } from '@/components/switch'
import { TextField } from '@/components/text-field'

export type InputsProps = {
  'checkbox-group': Attrs<CheckboxGroupProps<unknown>, CheckboxGroupEmits<unknown>>
  'checkbox': Attrs<CheckboxProps<unknown>, CheckboxEmits>
  'radio-group': Attrs<RadioGroupProps<unknown>, RadioGroupEmits<unknown>>
  'radio': Attrs<RadioButtonProps<unknown>, RadioButtonEmits>
  'switch': Attrs<SwitchProps, SwitchEmits>
  'date': Attrs<DatePickerProps, DatePickerEmits>
  'select': Attrs<SelectProps<object, unknown, Key>, SelectEmits<unknown>>
  'autocomplete': Attrs<AutocompleteProps<object, unknown, Key>, AutocompleteEmits<unknown, Key>>
  'text': Attrs<TextFieldProps, TextFieldEmits>
  'number': Attrs<NumberFieldProps, NumberFieldEmits>
  'currency': Attrs<CurrencyFieldProps, CurrencyFieldEmits>
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

export type InputProps<T extends keyof InputsProps> = {
  type: T
  props: InputsProps[T]
}
