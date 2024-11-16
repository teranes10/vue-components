import Checkbox from './Checkbox.vue'
import type { CheckboxProps, CheckboxEmits } from './CheckboxConfig'

export function useCheckboxView(
  options: CheckboxProps<any> & EmitListenersOnly<CheckboxEmits> = {},
) {
  return (
    <Checkbox
      rules={options.rules}
      label={options.label || ''}
      modelValue={options.modelValue}
      value={options.value}
      icon={options.icon}
      color={options.color}
      disabled={options.disabled}
      onChecked={options.onChecked}
    />
  )
}

 type EmitListenersOnly<T> = {
   [K in keyof T as K extends `update:${string}`
     ? never
     : `on${Capitalize<string & K>}`]?: T[K] extends any[]
     ? (...args: T[K]) => void
     : () => void;
 }
