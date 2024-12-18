<script setup lang="ts">
import type { ButtonEmits, ButtonPressOptions, ButtonProps } from './ButtonConfig'
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

  const options: ButtonPressOptions = {
    stopLoading: () => {
      loading.value = false
    },
  }

  props.onPress?.(options)
}
</script>

<template>
  <button
    v-tooltip="tooltip!" :class="[styles.btn, {
      [styles.block]: block,
      [ButtonColorClasses[color][type]]: color && type,
    }, size ? ButtonSizeClasses[size] : type === 'icon' ? ButtonSizeClasses.xxs : undefined]" @click="onClick"
  >
    <LoadingIcon v-if="loading" icon="oval" :class="styles.btnIcon" />

    <Icon v-else-if="icon" :icon="icon" :class="styles.btnIcon" />

    <span v-if="!!text" :class="styles.btnText" v-text="text" />

    <slot />
  </button>
</template>
