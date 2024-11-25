<template>
    <li :class="[styles.column, 'er-diagram-entity-column']" v-bind="dataAttributes">
        <span :class="styles.name" v-text="name" />
        <span :class="styles.type" v-text="type" />
    </li>
</template>

<script setup lang="ts">
import styles from './ErDiagramColumn.module.css'
import { ErDiagramColumnProps } from './ErDiagramColumnConfig';

const props = defineProps<ErDiagramColumnProps>()

const dataAttributes = {
    'data-column-name': props.name,
    'data-column-type': props.type,
    ...(props.relationTable && { 'data-relation-table': props.relationTable }),
    ...(props.relationColumn && { 'data-relation-column': props.relationColumn }),
    ...(props.relationType && { 'data-relation-type': props.relationType }),
}
</script>
