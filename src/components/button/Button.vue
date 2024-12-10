<script setup lang="ts">
import type { ButtonClickOptions, ButtonEmits, ButtonProps } from './ButtonConfig'
import { LoadingIcon } from '@/components/loading'
import { vTooltip } from '@/components/tooltip'
import { Icon } from '@/shared/components/icon'
import { vModel } from '@teranes/vue-composables'
import styles from './Button.module.css'
import { ButtonColorClasses, ButtonSizeClasses } from './ButtonConfig'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'fill',
  color: 'default',
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

  const options: ButtonClickOptions = {
    stopLoading: () => {
      loading.value = false
    },
  }

  emit('clicked', options)
}
</script>

<template>
  <button
    v-tooltip="tooltip!" :class="[styles.btn, {
      [styles.block]: block,
      [ButtonSizeClasses[size!]]: size,
      [ButtonColorClasses[color][type]]: color && type,
    }]" @click="onClick"
  >
    <LoadingIcon v-if="loading" icon="oval" :class="styles.btnIcon" />

    <Icon v-else-if="icon" :icon="icon" :class="styles.btnIcon" />

    <span v-if="!!text" :class="styles.btnText" v-text="text" />

    <slot />
  </button>
</template>
