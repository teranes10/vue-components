<template>
    <li :class="styles.tabItem" @click="onSelect">
        <button :class="[styles.tab, { [styles.active]: active }]" type="button">
            <template v-if="!!icon">
                <i :data-lucide="icon" :class="[styles.tabIcon, { 'mr-2': !!text }]"></i>
            </template>
            <template v-if="!!text">
                {{ text }}
            </template>
        </button>
    </li>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { TabProps } from './TabConfig';
import { TabsGroupContext, TabsGroupContextKey } from '../../TabsConfig';
import styles from './Tab.module.css'

defineProps<TabProps>()

const group = inject<TabsGroupContext | undefined>(TabsGroupContextKey, undefined)
const id = group?.onTabInitialize?.()
const active = computed(() => id === group?.selected?.value)

function onSelect() {
    group?.onSelect?.(id)
}
</script>
