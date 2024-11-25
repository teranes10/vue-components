<template>
    <component v-if="type" :is="typeof type === 'string' ? components[type] : type" v-bind="props" />
</template>

<script setup lang="ts" generic="T extends keyof ComponentsProps">
import { type ComponentProps, type ComponentsProps, components } from './ComponentConfig'
defineProps<ComponentProps<T>>()
</script>