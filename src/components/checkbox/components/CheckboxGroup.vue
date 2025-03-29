<script setup lang="ts" generic="V">
import type { ValidationFieldContext } from '@/functions/validation/ValidationConfig'
import type { CheckBoxGroupContext, CheckboxGroupEmits, CheckboxGroupProps } from './CheckboxGroupConfig'
import { useFieldValidation } from '@/functions/validation/Validation'
import { vModel } from '@teranes/vue-composables'
import { computed, onMounted, provide, reactive, ref, type Ref, shallowRef, watch } from 'vue'
import Checkbox from '../Checkbox.vue'
import styles from './CheckboxGroup.module.css'
import { CheckboxGroupContextKey, CheckboxGroupSizeClasses } from './CheckboxGroupConfig'

const props = withDefaults(defineProps<CheckboxGroupProps<V>>(), {
  inline: true,
})

const emit = defineEmits<CheckboxGroupEmits<V>>()

const checkboxes = reactive(new Map<V, Ref<boolean>>())

const value = vModel(props, 'modelValue', emit, [])

watch(value, (values: V[]) => {
  Array.from(checkboxes.entries()).forEach(([value, checked]) => {
    const isChecked = values.findIndex(x => x === value) > -1
    if (checked.value !== isChecked) {
      checked.value = isChecked
    }
  })
})

const ctx = computed<CheckBoxGroupContext<V>>(() => ({
  icon: props.icon,
  color: props.color,
  size: props.size,
  inline: props.inline,
  onInitialize: (value: V, checked: Ref<boolean>) => {
    checkboxes.set(value, checked)
  },
  onCheckChanged: () => {
    const values = Array.from(checkboxes)
      .filter(([, value]) => value.value)
      .map(([key]) => key)

    value.value = values
  },
}))

const checkboxContainerElement = ref<HTMLDivElement>()
const errorsListElement = ref<HTMLUListElement>()
const validationCtx = shallowRef<ValidationFieldContext>()
onMounted(() => {
  if (props.rules) {
    validationCtx.value = useFieldValidation({
      rules: props.rules,
      value,
      inputContainer: checkboxContainerElement.value,
      errorsListElement: errorsListElement.value,
    })
  }
})

const items = computed(() => props.items?.map(x => ({ ...{ icon: props.icon, color: props.color, size: props.size }, ...x })))

provide(CheckboxGroupContextKey, ctx)
</script>

<template>
  <div :class="styles.checkboxGroup">
    <div v-if="label || tag" :class="styles.checkboxGroupLabelContainer">
      <span v-if="label" :class="[styles.checkboxGroupLabel, { [styles.required]: !!required }]" v-text="label" />
      <span v-if="tag" :class="styles.checkboxGroupTag" v-text="tag" />
    </div>

    <div
      ref="checkboxContainerElement"
      :class="[styles.checkboxGroupContainer, styles.auto, {
        [CheckboxGroupSizeClasses[size!]]: !!size,
        [styles.inline]: props.inline,
        [styles.error]: validationCtx?.isError.value,
      }]"
    >
      <Checkbox v-for="item in items" v-bind="{ ...item, ...(size && { size }) }" :key="item.label" />
      <slot />
    </div>

    <ul ref="errorsListElement" :class="styles.checkboxGroupErrorsContainer" />
  </div>
</template>
