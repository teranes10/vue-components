<template>
  <div :class="[styles.alert, { [AlertColorClasses[type]]: type }]">
    <div :class="styles.alertContent">
      <component :is="icon ? icon : AlertIcons[type]" v-bind="{ class: styles.alertIcon }" />

      <div v-if="title" :class="styles.alertTitle" v-text="title" />

      <!-- eslint-disable vue/no-v-html -->
      <div v-if="text" :class="styles.alertText" v-html="text" />
    </div>

    <div :class="styles.alertActions">
      <Button :class="[styles.alertAction, closeButton?.class]" :icon="closeButton?.icon" :text="closeButton?.text"
        type="outline" color="gray" @click="closeButton?.onClick" />

      <Button :class="[styles.alertAction, confirmButton?.class]" :color="type" :icon="confirmButton?.icon"
        :text="confirmButton?.text" @click="confirmButton?.onClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/button'
import { type AlertProps, AlertIcons, AlertColorClasses } from './AlertConfig'
import styles from './Alert.module.css'

withDefaults(defineProps<AlertProps>(), {
  type: 'info',
})
</script>
