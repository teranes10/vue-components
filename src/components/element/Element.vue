<script setup lang="ts" generic="T extends keyof ElementsProps | Component">
import type { Component } from 'vue'
import { type ElementProps, elements, type ElementsProps, isComponent } from './ElementConfig'

defineProps<ElementProps<T>>()
</script>

<template>
  <component :is="isComponent(type) ? type : elements[type as keyof ElementsProps]" v-if="type" v-bind="props" />
</template>
