<script setup lang="ts">
import type { MenuProps } from './MenuConfig'
import Dropdown from './components/dropdown/Dropdown.vue'

defineProps<MenuProps>()
</script>

<template>
  <Dropdown :items="items">
    <template #activator>
      <slot name="activator" />
    </template>
  </Dropdown>
</template>
