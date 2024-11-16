import Widget from "../../../input-widget/InputWidget.vue";
import { type InputComponentProps } from "../../../input-widget/InputWidgetConfig";

export function useFormFieldView<T extends keyof InputComponentProps>(
  type: T,
  props: InputComponentProps[T]
) {
  return <Widget type={type} props={props} />;
}
