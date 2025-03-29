<script setup lang="ts">
import type { ErDiagramEntityProps } from './ErDiagramEntityConfig'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ErDiagramColumn from '../er-diagram-column/ErDiagramColumn.vue'
import styles from './ErDiagramEntity.module.css'

defineProps<ErDiagramEntityProps>()

const show = ref()
const entityElement = ref()
let observer: MutationObserver | undefined

onMounted(() => {
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'style') {
        if (entityElement.value.style.inset) {
          show.value = true
          observer?.disconnect?.()
          observer = undefined
        }
      }
    })
  })

  observer.observe(entityElement.value, { attributes: true })
})

onBeforeUnmount(() => {
  observer?.disconnect?.()
})
</script>

<template>
  <div
    ref="entityElement" class="er-diagram-entity" :class="[styles.entity]" :data-entity-name="name"
    :style="{ visibility: show ? 'visible' : 'hidden' }"
  >
    <h2 class="er-diagram-entity-header" :class="[styles.header]" v-text="name" />
    <ul :class="styles.columns">
      <ErDiagramColumn v-for="column in columns" v-bind="column" :key="column.name" />
      <slot />
    </ul>
  </div>
</template>
