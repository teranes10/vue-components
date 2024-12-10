<script setup lang="ts">
import type { DropdownEmits, DropdownItem, DropdownProps } from './DropdownConfig'
import { type Popper, popper as usePopper } from '@teranes/popper'
import { throttle } from '@teranes/utils'
import { vModel } from '@teranes/vue-composables'
import { onMounted, onUnmounted, ref, useAttrs } from 'vue'
import styles from './Dropdown.module.css'

const props = withDefaults(defineProps<DropdownProps>(), {
  persistent: false,
  block: false,
  noEvents: false,
})
const emit = defineEmits<DropdownEmits>()
const attrs = useAttrs()
const isShowing = vModel(props, 'modelValue', emit, false)

let popper: Popper
const referenceElement = ref<HTMLDivElement>()
const dropdownElement = ref<HTMLDivElement>()
const itemsContainerElement = ref<HTMLDivElement>()

function show() {
  popper.show()
  emit('show')
}

function hide() {
  if (isShowing.value) {
    popper.hide()
    emit('hide')
  }
}

const toggle = throttle(() => {
  if (attrs?.disabled) {
    return
  }

  isShowing.value ? hide() : show()
}, 25)

function onSelect(item: DropdownItem) {
  hide()
  emit('select', item)
  item.onSelect && item.onSelect()
}

onMounted(() => {
  if (dropdownElement.value && referenceElement.value) {
    popper = usePopper({
      popperEl: dropdownElement.value,
      referenceEl: referenceElement.value,
      persistent: props.persistent,
      activeClass: 'show',
      offset: [0, 5],
      modifiers: props.sameWidth ? ['same-width'] : [],
      onStateChanged(type, value) {
        if (type === 'show') {
          isShowing.value = value
        }
      },
    })
  }
})

onUnmounted(() => {
  if (popper) {
    popper.destroy()
  }
})

defineExpose({ isShowing, toggle, show, hide, dropdownElement, itemsContainerElement })
</script>

<template>
  <div :class="styles.dropdownContainer">
    <div ref="referenceElement" :class="[styles.dropdownActivator, { [styles.block]: block }]" @click="toggle">
      <slot name="activator" />
    </div>

    <div ref="dropdownElement" :class="styles.dropdown">
      <div v-if="$slots.header" :class="styles.dropdownHeader">
        <slot name="header" />
      </div>

      <div v-if="$slots.items || items && items.length > 0" :class="styles.dropdownContent">
        <slot v-if="$slots.items" name="items" :items="items" />
        <div v-else ref="itemsContainerElement" :class="styles.dropdownItemsContainer">
          <div v-for="item in items" :key="item.text" :class="styles.dropdownItem" @click="onSelect(item)">
            <slot v-if="$slots.item" name="item" :item="item" />

            <template v-else>
              <span :class="styles.dropdownItemIconContainer">
                <component :is="item.icon" :class="styles.dropdownItemIcon" />
              </span>

              <span :class="styles.dropdownItemText" v-text="item.text" />
            </template>
          </div>
        </div>
      </div>

      <div v-if="$slots.footer" :class="styles.dropdownFooter">
        <slot v-if="$slots.footer" name="footer" />
      </div>
    </div>
  </div>
</template>
