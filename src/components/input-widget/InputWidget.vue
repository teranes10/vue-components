<template>
  <component :is="widget" v-bind="props.props" />
</template>

<script setup lang="ts" generic="T extends keyof InputComponentProps">
import { computed } from 'vue'
import { type VNodeTypes } from 'vue'
import { type InputWidgetProps, type InputComponentProps, inputComponents } from './InputWidgetConfig'

const props = defineProps<InputWidgetProps<T>>()
const widget = computed<VNodeTypes>(() => inputComponents[props.type])
</script>
