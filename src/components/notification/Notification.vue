<script setup lang="ts">
import type { NotificationProps } from './NotificationConfig'
import Toastify from 'toastify-js'
import { onMounted, ref } from 'vue'
import styles from './Notification.module.css'
import 'toastify-js/src/toastify.css'

const props = withDefaults(defineProps<NotificationProps>(), {
  duration: 3000,
  gravity: 'top',
  position: 'right',
  stopOnFocus: true,
  autoShow: true,
})

const notificationElement = ref<HTMLElement>()
let toast: any

onMounted(() => {
  if (notificationElement.value) {
    toast = Toastify({
      newWindow: true,
      className: styles.notificationContainer,
      node: notificationElement.value,
      duration: props.duration,
      gravity: props.gravity,
      position: props.position,
      stopOnFocus: props.stopOnFocus,
    })

    if (props.autoShow) {
      toast.showToast()
    }
  }
})

function show() {
  if (toast) {
    toast.showToast()
  }
}

function hide() {
  if (toast) {
    toast.hideToast()
  }
}

defineExpose({ show, hide })
</script>

<template>
  <div ref="notificationElement">
    <slot :hide="hide" />
  </div>
</template>
