<script setup lang="ts">
import type { ColumnElement, EntityElement, ErDiagramProps } from './ErDiagramConfig'
import { draggable } from '@teranes/utils'
import { onMounted, ref } from 'vue'
import ErDiagramEntity from './components/er-diagram-entity/ErDiagramEntity.vue'
import styles from './ErDiagram.module.css'
import { autoCorrectPositions, updateConnections, updateEntityPosition } from './ErDiagramConfig'

const props = withDefaults(defineProps<ErDiagramProps>(), {
  gap: 50,
})

const containerEl = ref<HTMLElement>()
const entities = new Map<string, EntityElement>()

onMounted(() => setTimeout(() => {
  if (!containerEl.value) {
    return
  }

  const gap = props.gap
  const containerElement = containerEl.value
  const entityElements = Array.from(containerEl.value.querySelectorAll('.er-diagram-entity')) as HTMLElement[]

  for (const entityElement of entityElements) {
    const pointerElement = entityElement.querySelector('.er-diagram-entity-header') as HTMLElement
    const columnElements = Array.from(entityElement.querySelectorAll('.er-diagram-entity-column')) as HTMLElement[]

    const columns = columnElements.map((el) => {
      const name = el.dataset.columnName || ''
      const type = el.dataset.columnType || ''
      const constraints = [] as string[]

      const rTable = el.dataset.relationTable || ''
      const rColumn = el.dataset.relationColumn || ''
      const rType = el.dataset.relationType || ''
      const relationship = rTable
        ? {
            table: rTable,
            column: rColumn,
            type: rType,
          }
        : undefined

      return { name, type, el, constraints, relationship }
    }) as ColumnElement[]

    const entity = {
      name: entityElement.dataset.entityName || '',
      columns,
      el: entityElement,
      pointerEl: pointerElement,
      x: 0,
      y: 0,
      w: entityElement.offsetWidth,
      h: entityElement.offsetHeight,
    } as EntityElement

    entities.set(entity.name, entity)

    draggable(entityElement, {
      handleElement: pointerElement,
      dragAreaElement: containerElement,
      callback: (x: number, y: number) => {
        updateEntityPosition(entity, x, y)
        updateConnections(entities, containerElement, gap)
      },
    })
  }

  autoCorrectPositions(entities, containerElement, gap)

  setTimeout(() => {
    updateConnections(entities, containerElement, gap)
  }, 25)
}, 250))
</script>

<template>
  <div ref="containerEl" :class="styles.entityContainer">
    <ErDiagramEntity v-for="item in items" v-bind="item" :key="item.name" />
    <slot />
  </div>
</template>
