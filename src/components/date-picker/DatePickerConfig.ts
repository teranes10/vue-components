export type DatePickerType = 'date' | 'time' | 'datetime'

export const DatePickerFormat: Record<DatePickerType, string> = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  datetime: 'YYYY-MM-DDTHH:mm:ss',
}

export const DatePickerDisplayFormat: Record<DatePickerType, string> = {
  date: 'Do MMM YYYY',
  time: 'h:mm:ss a',
  datetime: 'h:mm:ss a, Do MMM YYYY',
}

export interface DatePickerProps {
  modelValue?: string
  type: DatePickerType
  format?: string
  displayFormat?: string
}

export type DatePickerEmits = {
  'update:modelValue': [value: string]
}
