<script setup lang="ts">
import type { ImageEmits, ImageProps } from './ImageConfig'
import { getModule } from '@/functions/getModule'
import { boolean } from '@teranes/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import * as Zoom from 'zoom-vanilla.js'
import DefaultImage from '../../assets/images/image-placeholder.webp'
import styles from './Image.module.css'
import './Image.css'

const props = withDefaults(defineProps<ImageProps>(), {
  width: 36,
  height: 36,
  defaultSrc: DefaultImage,
  preview: true,
  hoverWindow: true,
  hoverWidth: 200,
  hoverHeight: 200,
})

defineEmits<ImageEmits>()

const hoverWindow = computed(() => boolean(props.hoverWindow))
const isLoaded = ref(false)
const imageSrc = computed(() => (isLoaded.value ? props.src : props.defaultSrc))

watch(
  () => props.src,
  () => {
    isLoaded.value = false

    const img = new Image()

    img.onload = function () {
      isLoaded.value = true
    }

    img.src = props.src
  },
  { immediate: true },
)

const popperEl = ref<HTMLDivElement>()
const referenceEl = ref<HTMLDivElement>()
let popper: any

function hide() {
  popper?.hide()
}

onMounted(async () => {
  if (typeof Zoom === 'function') {
    Zoom()
  }

  if (hoverWindow.value) {
    getModule('@teranes/popper', 'POPPER').then((module) => {
      const { popper: usePopper } = module
      if (popperEl.value && referenceEl.value) {
        popper = usePopper({
          popperEl: popperEl.value,
          referenceEl: referenceEl.value,
          placement: 'right-start',
          action: 'hover',
          offset: [0, 10],
          duplicates: true,
        })

        referenceEl.value.addEventListener('mouseup', hide)
      }
    })
  }
})

onUnmounted(() => {
  if (referenceEl.value) {
    referenceEl.value.removeEventListener('mouseup', hide)
  }
})
</script>

<template>
  <div :class="styles.imageContainer">
    <div ref="referenceEl" :style="{ width: `${width}px`, height: `${height}px` }">
      <img
        :src="imageSrc" :alt="alt || title || subTitle || ''"
        :data-action="`${boolean(preview) ? 'zoom' : ''}`" :class="styles.image"
      >
    </div>

    <div
      v-if="title || subTitle" :class="[styles.titleContainer, { [styles.clickable]: onClick }]"
      @click="onClick"
    >
      <div v-if="title" :class="styles.title" v-text="title" />
      <div v-if="subTitle" :class="styles.subTitle" v-text="subTitle" />
    </div>

    <div
      v-if="hoverWindow" ref="popperEl" class="image-hover-window " :style="{
        width: `${hoverWidth}px`, height: `${hoverHeight}px`,
      }"
    >
      <img :src="imageSrc" :alt="alt || title || subTitle || ''" class="image-hover-window-image">
    </div>
  </div>
</template>
