<template>
  <div v-if="loading" :class="styles.loading">
    <LoadingIcon icon="dots" color="white" :class="styles.loadingIcon" />
    <span v-if="text" :class="styles.loadingText" v-text="text" />
  </div>
</template>

<script lang="ts" setup>
import LoadingIcon from './components/loading-icon/LoadingIcon.vue'
import type { LoadingProps } from './LoadingConfig'
import styles from './Loading.module.css'

withDefaults(defineProps<LoadingProps>(), {
  loading: false,
})
</script>
