import { type Component as ComponentType } from "vue";
import Component from "./Component.vue";
import { ComponentProps, ComponentsProps } from "./ComponentConfig";

export function useComponentView<
  T extends keyof ComponentsProps | ComponentType,
>(type: ComponentProps<T>["type"], props: ComponentProps<T>["props"]) {
  return <Component type={type} props={props} />;
}
