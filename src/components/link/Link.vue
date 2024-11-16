<template>
    <a :class="['font-medium click-eff text-primary underline decoration-dotted', props.class ? props.class : '']"
        v-text="text" @click="onClick" />
</template>

<script setup lang="ts">
const props = defineProps<{
    text: string
    class?: string
}>()

defineEmits<{
    click: []
}>()
</script>
