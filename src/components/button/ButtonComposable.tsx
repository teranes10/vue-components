import type { FunctionalComponent } from "vue";
import Button from "./Button.vue";

export interface IconBtnViewOptions {
  class?: string;
  text?: string;
  tooltip?: string;
  onClick?: () => void;
}

export function useIconBtnView(
  icon: FunctionalComponent<any>,
  {
    class: className = "",
    text = "",
    tooltip = "",
    onClick,
  }: IconBtnViewOptions = {}
) {
  return (
    <Button
      class={className}
      icon={icon}
      text={text}
      tooltip={tooltip}
      onClicked={onClick}
    />
  );
}
