<template>
  <button v-tooltip="tooltip!" :class="[styles.btn, {
    [styles.block]: block,
    [ButtonSizeClasses[size!]]: size,
    [ButtonColorClasses[color][type]]: color && type,
  }]" @click="onClick">
    <LoadingIcon v-if="loading" icon="oval" :class="styles.btnIcon" />

    <i :data-lucide="icon" :class="styles.btnIcon" v-else-if="icon"></i>

    <span v-if="!!text" :class="styles.btnText" v-text="text" />

    <slot />
  </button>
</template>

<script setup lang="ts">
import { vModel } from '@teranes/vue-composables'
import { LoadingIcon } from '@/components/loading'
import { vTooltip } from '@/components/tooltip'
import { ButtonSizeClasses, ButtonColorClasses } from './ButtonConfig'
import type { ButtonEmits, ButtonProps, ButtonClickOptions } from './ButtonConfig'
import styles from './Button.module.css'

const emit = defineEmits<ButtonEmits>()

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'fill',
  color: 'default',
  isLoading: false,
  loading: false,
  loadingText: 'Loading...',
})

const loading = vModel(props, 'isLoading', emit, false)

const onClick = () => {
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
