import Button from "./Button.vue";
import { IconValue } from "@/shared/components/icon";

export interface IconBtnViewOptions {
  class?: string;
  text?: string;
  tooltip?: string;
  onClick?: () => void;
}

export function useIconBtnView(
  icon: IconValue,
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
