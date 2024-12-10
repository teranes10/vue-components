<script setup lang="ts" generic="T extends keyof InputsProps">
import { type InputProps, inputs, type InputsProps } from './InputConfig'

defineProps<InputProps<T>>()
</script>

<template>
  <component :is="inputs[type]" v-if="type" v-bind="props" />
</template>
