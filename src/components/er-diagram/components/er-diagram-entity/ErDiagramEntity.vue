<script setup lang="ts">
import type { ErDiagramEntityProps } from './ErDiagramEntityConfig'
import ErDiagramColumn from '../er-diagram-column/ErDiagramColumn.vue'
import styles from './ErDiagramEntity.module.css'

defineProps<ErDiagramEntityProps>()
</script>

<template>
  <div class="er-diagram-entity" :class="[styles.entity]" :data-entity-name="name">
    <h2 class="er-diagram-entity-header" :class="[styles.header]" v-text="name" />
    <ul :class="styles.columns">
      <ErDiagramColumn v-for="column in columns" v-bind="column" :key="column.name" />
      <slot />
    </ul>
  </div>
</template>
