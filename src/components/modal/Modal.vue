<template>
  <div :class="[styles.modalOverlay, { [styles.show]: isShowing }]" @click="onOutSideClick"
    @contextmenu="onOutSideClick">
    <section ref="modalElement" :class="styles.modal" :style="{ width: `${width}px` }">
      <div v-if="$slots.header" ref="modalHeaderElement" :class="styles.modalHeader">
        <span :class="styles.modalTitle">
          <slot name="header" />
        </span>
        <XCircleIcon :class="styles.modalCloseBtn" @click="() => isShowing = false" />
      </div>

      <div :class="styles.modalContent">
        <slot />
      </div>

      <div v-if="$slots.footer" :class="styles.modalFooter">
        <slot name="footer" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { XCircleIcon } from 'lucide-vue-next'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { draggable } from '@teranes/utils'
import { vModel } from '@teranes/vue-composables'
import type { ModalEmits, ModalProps } from './ModalConfig'
import styles from './Modal.module.css'

const props = withDefaults(defineProps<ModalProps>(), {
  persistent: false,
  width: 500,
})

const emit = defineEmits<ModalEmits>()

const isShowing = vModel(props, 'modelValue', emit, false)

const width = vModel(props, 'width', emit)

function updateWidth() {
  const screenWidth = window.innerWidth
  width.value = props.width > screenWidth ? screenWidth - 25 : props.width
}

const modalElement = ref<HTMLDivElement>()
const modalHeaderElement = ref<HTMLDivElement>()

onMounted(() => {
  if (document) {
    updateWidth()
    window.addEventListener('resize', updateWidth)

    if (modalElement.value && modalHeaderElement.value) {
      draggable(modalElement.value, modalHeaderElement.value)
    }

    watch(isShowing, (value) => {
      document.body.style.overflow = value ? 'hidden' : 'auto'
    }, { immediate: true })
  }
})

onUnmounted(() => {
  if (document) {
    window.removeEventListener('resize', updateWidth)
    document.body.style.overflow = 'auto'
  }
})

const onOutSideClick = (e: MouseEvent) => {
  if (!props.persistent) {
    if (modalElement.value && !modalElement.value.contains((e.target as Node))) {
      isShowing.value = false
    }
  }
}
</script>
