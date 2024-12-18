<script lang="ts" setup>
import type { LoadingProps } from './LoadingConfig'
import LoadingIcon from './components/loading-icon/LoadingIcon.vue'
import styles from './Loading.module.css'

withDefaults(defineProps<LoadingProps>(), {
  loading: false,
  inline: false,
  icon: 'dots',
})
</script>

<template>
  <div v-if="loading" :class="[styles.loading, { [styles.inline]: inline }]">
    <LoadingIcon :icon="icon" :color="color" :class="styles.loadingIcon" />
    <span v-if="text" :class="styles.loadingText" v-text="text" />
  </div>
</template>
