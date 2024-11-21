<template>
  <div :class="[styles.toast, { [ToastColorClasses[type!]]: type }]">
    <Icon :icon="ToastIcons[type]" v-if="type" :class="styles.toastIcon" />

    <span v-if="text" v-text="text" />

    <Icon :icon="X" v-if="close" :class="styles.toastCloseBtn" @click="close" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/shared/components/icon'
import { X } from 'lucide'
import { type ToastProps, ToastColorClasses, ToastIcons } from './ToastConfig'
import styles from './Toast.module.css'

withDefaults(defineProps<ToastProps>(), {
  type: 'success',
})
</script>
