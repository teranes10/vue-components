<script setup lang="ts">
import type { LoadingIconProps } from './LoadingIconConfig'
import styles from './LoadingIcon.module.css'

const props = withDefaults(defineProps<LoadingIconProps>(), {
  icon: 'oval',
  color: '#ffffff',
  class: '',
})
</script>

<template>
  <svg
    v-if="icon === 'oval'" :class="[styles.loading, props.class || '']" width="25" viewBox="-2 -2 42 42"
    xmlns="http://www.w3.org/2000/svg" :stroke="color"
  >
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)" stroke-width="4">
        <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
  <svg
    v-else-if="icon === 'dots'" :class="[styles.loading, props.class || '']" width="25" viewBox="0 0 120 30"
    xmlns="http://www.w3.org/2000/svg" :fill="color"
  >
    <circle cx="15" cy="15" r="15">
      <animate
        attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="60" cy="15" r="9" fill-opacity="0.3">
      <animate
        attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="105" cy="15" r="15">
      <animate
        attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
</template>
