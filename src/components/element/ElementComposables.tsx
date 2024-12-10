import type { Component } from 'vue'
import type { ElementProps, ElementsProps } from './ElementConfig'
import Element from './Element.vue'

export function useComponentView<
  T extends keyof ElementsProps | Component,
>(type: ElementProps<T>['type'], props: ElementProps<T>['props']) {
  return <Element type={type} props={props} />
}
