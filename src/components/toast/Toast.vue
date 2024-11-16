<template>
  <div :class="[styles.toast, { [ToastColorClasses[type!]]: type }]">
    <component
      :is="ToastIcons[type]"
      v-if="type"
      :class="styles.toastIcon"
    />

    <span
      v-if="text"
      v-text="text"
    />

    <XIcon
      v-if="close"
      :class="styles.toastCloseBtn"
      @click="close"
    />
  </div>
</template>

<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import { type ToastProps, ToastColorClasses, ToastIcons } from './ToastConfig'
import styles from './Toast.module.css'

withDefaults(defineProps<ToastProps>(), {
  type: 'success',
})
</script>
