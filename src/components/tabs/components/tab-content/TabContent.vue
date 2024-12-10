<script setup lang="ts">
import type { TabsGroupContext } from '../../TabsConfig'
import { computed, inject } from 'vue'
import { TabsGroupContextKey } from '../../TabsConfig'
import styles from './TabContent.module.css'

const group = inject<TabsGroupContext | undefined>(TabsGroupContextKey, undefined)
const id = group?.onTabContentInitialize?.()
const active = computed(() => id === group?.selected?.value)
</script>

<template>
  <div v-if="active" :class="styles.tabContent">
    <slot />
  </div>
</template>
