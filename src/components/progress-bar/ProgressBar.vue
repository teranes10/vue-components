<template>
    <div :class="styles.progressBar" :style="{ height: `${height}px` }">
        <div :class="styles.progress" :style="{ width: `${percentage}%`, background: color }" v-text="label" />
    </div>
</template>

<script setup lang="ts">
import styles from './ProgressBar.module.css'
import { computed } from 'vue';
import { ProgressBarProps } from './ProgressBarConfig';

const props = withDefaults(defineProps<ProgressBarProps>(), {
    height: 12,
    percentage: 0
})

const label = computed(() =>
    props.label != null ? props.label : (props.percentage?.toString() || 0) + '%',
)
</script>