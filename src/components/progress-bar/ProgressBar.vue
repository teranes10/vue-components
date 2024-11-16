<template>
    <div class="w-full h-2 bg-gray-200 rounded dark:bg-gray-100" :style="{ height: `${height}px` }">
        <div class="bg-primary h-full rounded text-xs text-white flex justify-center items-center" role="progressbar"
            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
            :style="{ width: `${percentage}%`, background: color }" v-text="label" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    percentage: number,
    label?: string
    height?: number,
    color?: string
}>(), {
    height: 12,
    percentage: 0
})

const label = computed(() =>
    props.label != null ? props.label : (props.percentage?.toString() || 0) + '%',
)
</script>