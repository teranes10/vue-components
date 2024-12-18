<script setup lang="ts">
import { Button } from '@/components/button'
import { Icon } from '@/shared/components/icon'
import styles from './Alert.module.css'
import { AlertColorClasses, AlertIcons, type AlertProps } from './AlertConfig'

withDefaults(defineProps<AlertProps>(), {
  type: 'info',
})
</script>

<template>
  <div :class="[styles.alert, { [AlertColorClasses[type]]: type }]">
    <div :class="styles.alertContent">
      <Icon :icon="icon ? icon : AlertIcons[type]" v-bind="{ class: styles.alertIcon }" />

      <div v-if="title" :class="styles.alertTitle" v-text="title" />

      <div v-if="text" :class="styles.alertText">
        <template v-if="typeof text === 'string'">
          {{ text }}
        </template>
        <component :is="text" v-else />
      </div>
    </div>

    <div :class="styles.alertActions">
      <Button
        :class="[styles.alertAction, closeButton?.class]" :icon="closeButton?.icon" :text="closeButton?.text"
        color="gray" @press="closeButton?.onClick"
      />

      <Button
        :class="[styles.alertAction, confirmButton?.class]" :color="type" :icon="confirmButton?.icon"
        :text="confirmButton?.text" @press="confirmButton?.onClick"
      />
    </div>
  </div>
</template>
