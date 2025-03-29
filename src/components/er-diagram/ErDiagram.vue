<script setup lang="ts">
import type { ErDiagramEntityProps } from './components/er-diagram-entity/ErDiagramEntityConfig'
import type { ColumnElement, EntityElement, ErDiagramProps } from './ErDiagramConfig'
import { renderComponent } from '@/functions/dom/Element'
import { draggable } from '@teranes/utils'
import { onMounted, ref } from 'vue'
import ErDiagramEntity from './components/er-diagram-entity/ErDiagramEntity.vue'
import styles from './ErDiagram.module.css'
import { autoCorrectPositions, updateConnections, updateEntityPosition } from './ErDiagramConfig'

const props = withDefaults(defineProps<ErDiagramProps>(), {
  gap: 50,
})

const containerEl = ref<HTMLElement>()
const entities = ref(new Map<string, EntityElement>())

onMounted(() => setTimeout(render, 250))

function render() {
  if (!containerEl.value) {
    return
  }

  entities.value = getEntityElements()
  entities.value.forEach(setupEntityElement)

  autoCorrect()
  setTimeout(update, 25)
}

function getEntityElements() {
  if (!containerEl.value) {
    return new Map()
  }

  const map = new Map<string, EntityElement>()

  const entityElements = Array.from(containerEl.value.querySelectorAll('.er-diagram-entity')) as HTMLElement[]
  for (const entityElement of entityElements) {
    const entity = getEntityFromElement(entityElement)
    map.set(entity.name, entity)
  }

  return map
}

function getEntityFromElement(element: HTMLElement) {
  const pointerElement = element.querySelector('.er-diagram-entity-header') as HTMLElement
  const columnElements = Array.from(element.querySelectorAll('.er-diagram-entity-column')) as HTMLElement[]

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

  return {
    name: element.dataset.entityName || '',
    columns,
    el: element,
    pointerEl: pointerElement,
    x: 0,
    y: 0,
    w: element.offsetWidth,
    h: element.offsetHeight,
  } as EntityElement
}

function setupEntityElement(entity: EntityElement) {
  draggable(entity.el, {
    handleElement: entity.pointerEl,
    dragAreaElement: containerEl.value,
    callback: (x: number, y: number) => {
      updateEntityPosition(entity, x, y)
      update()
    },
  })
}

function autoCorrect() {
  if (containerEl.value) {
    autoCorrectPositions(entities.value, containerEl.value, props.gap)
  }
}

function update() {
  if (containerEl.value) {
    updateConnections(entities.value, containerEl.value, props.gap)
  }
}

async function addEntity(props: ErDiagramEntityProps) {
  if (!containerEl.value) {
    return
  }

  const el = await renderComponent(ErDiagramEntity, props)
  containerEl.value.append(el)

  const entity = getEntityFromElement(el)
  entities.value.set(entity.name, entity)

  setupEntityElement(entity)

  autoCorrect()
  setTimeout(update, 25)
}

defineExpose({ entities, getEntityElements, getEntityFromElement, setupEntityElement, render, autoCorrect, update, addEntity })
</script>

<template>
  <div ref="containerEl" :class="styles.entityContainer">
    <ErDiagramEntity v-for="item in items" v-bind="item" :key="item.name" />
    <slot />
  </div>
</template>
