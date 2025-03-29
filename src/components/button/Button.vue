<script setup lang="ts">
import type { ButtonEmits, ButtonPressOptions, ButtonProps } from './ButtonConfig'
import type { ButtonGroupContext } from './components/button-group/ButtonGroupConfig'
import { LoadingIcon } from '@/components/loading'
import { vTooltip } from '@/components/tooltip'
import { Icon } from '@/shared/components/icon'
import { vModel } from '@teranes/vue-composables'
import { inject } from 'vue'
import styles from './Button.module.css'
import { ButtonColorClasses, ButtonSizeClasses } from './ButtonConfig'
import { ButtonGroupContextKey } from './components/button-group/ButtonGroupConfig'

const props = withDefaults(defineProps<ButtonProps>(), {
  isLoading: false,
  loading: false,
  loadingText: 'Loading...',
})

const emit = defineEmits<ButtonEmits>()

const loading = vModel(props, 'isLoading', emit, false)

function onClick() {
  if (loading.value) {
    return
  }

  if (props.loading) {
    loading.value = true
  }

  const options: ButtonPressOptions = {
    stopLoading: () => {
      loading.value = false
    },
  }

  props.onPress?.(options)
}

const ctx = inject<ButtonGroupContext>(ButtonGroupContextKey, {})
</script>

<template>
  <button
    v-tooltip="tooltip!" :class="[styles.btn, {
      [styles.block]: block,
      [ButtonColorClasses[(color || ctx?.color || 'primary')!]?.[(type || ctx?.type || 'fill')!]]: (color || ctx?.color || 'primary') && (type || ctx?.type || 'fill'),
      [styles.active]: active,
    }, (size || ctx?.size) ? ButtonSizeClasses[(size || ctx?.size)!] : (type || ctx?.type) === 'icon' ? ButtonSizeClasses.xxs : undefined]"
    :style="{
      ...(width && { '--button-width': `${width}px` }),
      ...(height && { '--button-height': `${height}px` }),
    }"
    @click="onClick"
  >
    <LoadingIcon v-if="loading" icon="oval" :class="styles.btnIcon" />

    <Icon v-else-if="icon" :icon="icon" :class="styles.btnIcon" />

    <span v-if="!!text" :class="styles.btnText" v-text="text" />

    <slot />
  </button>
</template>
