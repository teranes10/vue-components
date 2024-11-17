import { type VNodeTypes, type FunctionalComponent } from "vue";
import Group from "./Group.vue";

export function useGroupView(...nodes: VNodeTypes[]) {
  const Nodes = nodes as FunctionalComponent<any>[];

  return (
    <Group>
      {Nodes.map((Node) => (
        <Node />
      ))}
    </Group>
  );
}
