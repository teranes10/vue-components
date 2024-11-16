<template>
  <Dropdown :items="items">
    <template #activator>
      <slot name="activator" />
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import Dropdown from './components/dropdown/Dropdown.vue'
import type { MenuProps } from './MenuConfig'

defineProps<MenuProps>()
</script>
