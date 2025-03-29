<script setup lang="ts" generic="V">
import type { ValidationFieldContext } from '@/functions/validation/ValidationConfig'
import { ButtonGroup } from '@/components/button'
import { useFieldValidation } from '@/functions/validation/Validation'
import { vModel } from '@teranes/vue-composables'
import { computed, onMounted, provide, reactive, ref, type Ref, shallowRef, watch } from 'vue'
import RadioButton from '../RadioButton.vue'
import styles from './RadioGroup.module.css'
import { type RadioGroupContext, RadioGroupContextKey, type RadioGroupEmits, type RadioGroupProps, RadioGroupSizeClasses } from './RadioGroupConfig'

const props = withDefaults(defineProps<RadioGroupProps<V>>(), {
  inline: true,
})

const emit = defineEmits<RadioGroupEmits<V>>()

const radioButtons = reactive(new Map<V, Ref<boolean>>())

const value = vModel(props, 'modelValue', emit) as Ref<V | undefined>

watch(value, (value) => {
  Array.from(radioButtons.entries()).forEach(([buttonValue, checked]) => {
    checked.value = buttonValue === value
  })
})

const radioButtonContainerElement = ref<HTMLDivElement>()
const errorsListElement = ref<HTMLUListElement>()
const validationCtx = shallowRef<ValidationFieldContext>()
onMounted(() => {
  if (props.rules) {
    validationCtx.value = useFieldValidation({
      rules: props.rules,
      value,
      inputContainer: radioButtonContainerElement.value,
      errorsListElement: errorsListElement.value,
    })
  }
})

const ctx = computed<RadioGroupContext<V>>(() => ({
  inline: props.inline,
  type: props.type === 'boxed' ? 'text-fill' : props.type,
  color: props.color,
  size: props.size,
  onInitialize: (value: V, checked: Ref<boolean>) => {
    radioButtons.set(value, checked)
  },
  onCheckChanged: (_value: V, checked: boolean) => {
    const newValue = checked ? _value : undefined
    value.value = newValue
  },
}))

const items = computed(() => props.items?.map(x => ({
  ...{
    type: props.type === 'boxed' ? 'text-fill' : props.type,
    color: props.color,
    size: props.size,
  },
  ...x,
})))

provide(RadioGroupContextKey, ctx)
</script>

<template>
  <div :class="styles.radioGroup">
    <div v-if="label || tag" :class="styles.radioGroupLabelContainer">
      <span v-if="label" :class="[styles.radioGroupLabel, { [styles.required]: !!required }]" v-text="label" />
      <span v-if="tag" :class="styles.radioGroupTag" v-text="tag" />
    </div>

    <ButtonGroup v-if="type" :type="type" :size="size" :color="color">
      <RadioButton v-for="item in items" v-bind="item" :key="item.label" />
      <slot />
    </ButtonGroup>

    <div
      v-else
      ref="radioButtonContainerElement"
      :class="[styles.radioGroupContainer, styles.auto, { [RadioGroupSizeClasses[size!]]: !!size, [styles.inline]: props.inline, [styles.error]: validationCtx?.isError.value }]"
    >
      <RadioButton v-for="item in items" v-bind="item" :key="item.label" />
      <slot />
    </div>

    <ul ref="errorsListElement" :class="styles.radioGroupErrorsContainer" />
  </div>
</template>
