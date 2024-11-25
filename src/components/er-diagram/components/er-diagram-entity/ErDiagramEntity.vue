<template>
    <div :class="[styles.entity, 'er-diagram-entity']" :data-entity-name="name">
        <h2 :class="[styles.header, 'er-diagram-entity-header']" v-text="name" />
        <ul :class="styles.columns">
            <ErDiagramColumn v-bind="column" v-for="column in columns" />
            <slot />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ErDiagramEntityProps } from './ErDiagramEntityConfig';
import ErDiagramColumn from '../er-diagram-column/ErDiagramColumn.vue';
import styles from './ErDiagramEntity.module.css'

defineProps<ErDiagramEntityProps>()
</script>
