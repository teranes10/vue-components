<template>
    <div v-if="active">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { TabsGroupContext, TabsGroupContextKey } from '../../TabsConfig';

const group = inject<TabsGroupContext | undefined>(TabsGroupContextKey, undefined)
const id = group?.onTabContentInitialize?.()
const active = computed(() => id === group?.selected?.value)
</script>
