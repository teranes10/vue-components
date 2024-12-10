<script setup lang="ts">
import type { ErDiagramColumnProps } from './ErDiagramColumnConfig'
import styles from './ErDiagramColumn.module.css'

const props = defineProps<ErDiagramColumnProps>()

const dataAttributes = {
  'data-column-name': props.name,
  'data-column-type': props.type,
  ...(props.relationTable && { 'data-relation-table': props.relationTable }),
  ...(props.relationColumn && { 'data-relation-column': props.relationColumn }),
  ...(props.relationType && { 'data-relation-type': props.relationType }),
}
</script>

<template>
  <li class="er-diagram-entity-column" :class="[styles.column]" v-bind="dataAttributes">
    <span :class="styles.name" v-text="name" />
    <span :class="styles.type" v-text="type" />
  </li>
</template>
