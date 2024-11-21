<template>
    <svg v-bind="svgAttrs">
        <component :is="tag" v-bind="attrs" v-for="([tag, attrs], i) of svgChildren" :key="i" />
        <text v-if="text" :x="`${textX}%`" :y="`${textY}%`" :font-size="textSize" stroke-width="0.35"
            letter-spacing="0.5" text-anchor="middle" v-text="text" />
    </svg>
</template>

<script setup lang="ts">
import { IconProps } from './IconConfig';
import { IconNode, IconNodeChild, SVGProps } from 'lucide'

const props = withDefaults(defineProps<IconProps>(), {
    textX: 50,
    textY: 75,
    textSize: 5
});

const [_tag, attrs, children] = (typeof props.icon === 'string' ? getIcon(props.icon) : props.icon) || []

const svgAttrs: SVGProps = {
    ...(attrs || {}),
    ...(props.size && { width: props.size, height: props.size }),
    ...(props.strokeWidth && { 'stroke-width': props.strokeWidth }),
    ...(props.class && { class: (attrs?.class ? attrs.class + ' ' : '') + (props.class || '') }),
    ...(props.color && { stroke: props.color.startsWith('-') ? `var(--color${props.color})` : props.color }),
}

const svgChildren: IconNodeChild[] = children || []

function getIcon(name: string): IconNode | undefined {
    const lucide = (window as any)?.lucide
    if (!lucide) {
        console.error(`Lucide not found.`);
        return undefined
    }

    const icon = lucide[name]
    if (!icon) {
        console.error(`Lucide icon '${name}' not found.`);
        return undefined
    }

    return icon;
}
</script>
