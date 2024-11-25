import Input from "./Input.vue";
import { InputProps, InputsProps } from "./InputConfig";

export function useInputView<T extends keyof InputsProps>(
  type: InputProps<T>["type"],
  props: InputProps<T>["props"]
) {
  return <Input type={type} props={props} />;
}
