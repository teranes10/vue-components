<template>
    <div :class="styles.group">
        <slot />
    </div>
</template>

<script setup lang="ts">
import styles from './Group.module.css'
</script>