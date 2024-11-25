<template>
  <component v-if="type" :is="inputs[type]" v-bind="props" />
</template>

<script setup lang="ts" generic="T extends keyof InputsProps">
import { type InputProps, type InputsProps, inputs } from './InputConfig'
defineProps<InputProps<T>>()
</script>
