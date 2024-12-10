import type { InputProps, InputsProps } from './InputConfig'
import Input from './Input.vue'

export function useInputView<T extends keyof InputsProps>(
  type: InputProps<T>['type'],
  props: InputProps<T>['props'],
) {
  return <Input type={type} props={props} />
}
