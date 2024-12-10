<script setup lang="ts">
import { Icon } from '@/shared/components/icon'
import { X } from 'lucide'
import styles from './Toast.module.css'
import { ToastColorClasses, ToastIcons, type ToastProps } from './ToastConfig'

withDefaults(defineProps<ToastProps>(), {
  type: 'success',
})
</script>

<template>
  <div :class="[styles.toast, { [ToastColorClasses[type!]]: type }]">
    <Icon v-if="type" :icon="ToastIcons[type]" :class="styles.toastIcon" />

    <span v-if="text" v-text="text" />

    <Icon v-if="close" :icon="X" :class="styles.toastCloseBtn" @click="close" />
  </div>
</template>
