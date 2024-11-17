<template>
    <div class="flex items-center">
        <div ref="referenceEl" class="image-fit zoom-in" :style="{ width: `${width}px`, height: `${height}px` }">
            <img :src="imageSrc" :data-action="`${boolean(preview) ? 'zoom' : ''}`"
                class="cursor-pointer border-white rounded-lg w-full h-full object-cover" />
        </div>

        <div :class="['ml-4', { 'click-eff': onClick }]" @click="onClick" v-if="title || subTitle">
            <div class="font-medium whitespace-nowrap" v-text="title" v-if="title" />
            <div :class="['text-slate-500 text-xs whitespace-nowrap', { 'mt-0.5': title }]" v-text="subTitle"
                v-if="subTitle" />
        </div>

        <div v-if="hoverWindow" ref="popperEl" :style="{
            width: `200px`, height: `200px`, background: '#fff', borderRadius: '0.5rem',
            boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.25)', zIndex: 1000,
        }">
            <img :src="imageSrc" :alt="alt || title || subTitle || ''" class="w-full h-full object-cover rounded-lg" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { boolean } from '@teranes/utils'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import DefaultImage from "../../assets/images/image-placeholder.webp";
import { ImageEmits, ImageProps } from './ImageConfig';
import './Image.css'
import { getModule } from '@/functions/getModule';

const props = withDefaults(defineProps<ImageProps>(), {
    width: 36,
    height: 36,
    defaultSrc: DefaultImage,
    preview: true,
    hoverWindow: true
})

defineEmits<ImageEmits>();

const hoverWindow = computed(() => boolean(props.hoverWindow))
const isLoaded = ref(false);
const imageSrc = computed(() => (isLoaded.value ? props.src : props.defaultSrc));

watch(
    () => props.src,
    () => {
        isLoaded.value = false;

        const img = new Image();

        img.onload = function () {
            isLoaded.value = true;
        };

        img.src = props.src;
    },
    { immediate: true }
);

const popperEl = ref<HTMLDivElement>();
const referenceEl = ref<HTMLDivElement>();
let popper: any;

function hide() {
    popper?.hide();
}

onMounted(async () => {
    if (hoverWindow.value) {
        getModule('@teranes/popper', 'POPPER').then(module => {
            const { popper: usePopper } = module;
            if (popperEl.value && referenceEl.value) {
                popper = usePopper({
                    popperEl: popperEl.value,
                    referenceEl: referenceEl.value,
                    placement: "right-start",
                    action: "hover",
                    offset: [0, 10],
                    duplicates: true
                });

                referenceEl.value.addEventListener("mouseup", hide);
            }
        });
    }
});

onUnmounted(() => {
    if (referenceEl.value) {
        referenceEl.value.removeEventListener("mouseup", hide);
    }
});
</script>