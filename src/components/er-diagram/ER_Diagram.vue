<template>
    <div ref="containerEl" :class="styles.entityContainer">
        <div :class="styles.entity" :style="{ top: `${entity.y || 0}px`, left: `${entity.x || 0}px` }"
            :ref="(el) => setEntityElement(entity, el as HTMLElement)" v-for="entity in entities">
            <h2 :class="styles.header" :ref="(el) => entity.pointerEl = (el as HTMLElement)" v-text="entity.name" />
            <ul :class="styles.columns">
                <li :class="styles.column" :ref="(el) => column.el = (el as HTMLElement)"
                    v-for="column in entity.columns">
                    <span :class="styles.name" v-text="column.name" />
                    <span :class="styles.type" v-text="column.type" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Entity } from './ER_DiagramConfig';
import { updateConnections, autoCorrectPositions } from './ER_DiagramConfig';
import { ref } from 'vue';
import { draggable } from '@teranes/utils';
import { vModel } from '@teranes/vue-composables'
import styles from './ER_Diagram.module.css'

const props = withDefaults(defineProps<{ items: Entity[] }>(), {
    items: () => []
});

const gap = 50;
const containerEl = ref<HTMLElement>();
const entities = vModel(props, 'items')

const setEntityElement = (e: Entity, el: HTMLElement) => {
    if (e.el || !el || !e.pointerEl || !containerEl.value) {
        return;
    }

    e.el = el;
    draggable(e.el, e.pointerEl, containerEl.value, (x: number, y: number) => {
        e.x = x;
        e.y = y;

        updateConnections(entities, containerEl, gap);
    });

    autoCorrectPositions(entities, containerEl, gap);

    setTimeout(() => {
        updateConnections(entities, containerEl, gap);
    }, 25)
}
</script>
