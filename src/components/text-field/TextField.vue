<template>
  <label :class="styles.textField">
    <div v-if="label || tag" :class="styles.textFieldLabelContainer">
      <span v-if="label" :class="[styles.textFieldLabel, { [styles.textFieldLabel]: !!required }]" v-text="label" />
      <span v-if="tag" :class="styles.textFieldTag" v-text="tag" />
    </div>

    <div :class="styles.textFieldInputContainer">
      <div v-if="$slots.pre" ref="preTextElement" :class="styles.preText">
        <slot name="pre" />
      </div>

      <div v-if="$slots.post" ref="postTextElement" :class="styles.postText">
        <slot name="post" />
      </div>

      <textarea v-if="rows" ref="inputElement" :class="[styles.textFieldInput, {
        [TextFieldsSizesClasses[size!]]: !!size,
        [TextFieldBorderClasses[color!]]: !!color,
      }]" :placeholder="placeholder" :disabled="disabled" :value="value" :rows="rows" @input="onTextChange" />

      <input v-else ref="inputElement" :class="[styles.textFieldInput, {
        [TextFieldsSizesClasses[size!]]: !!size,
        [TextFieldBorderClasses[color!]]: !!color,
      }]" :placeholder="placeholder" :disabled="disabled" :value="value" @input="onTextChange">
    </div>

    <div v-if="helperText" :class="styles.textFieldHelperText" v-text="helperText" />

    <div v-if="message" :class="[styles.textFieldMessage, { [TextFieldMessageClasses[color!]]: !!color }]"
      v-text="message" />

    <ul ref="errorsListElement" :class="styles.textFieldErrorsContainer" />
  </label>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { type ValidationFieldContext } from '../../functions/validation/ValidationConfig'
import { useFieldValidation } from '../../functions/validation/Validation'
import { TextFieldBorderClasses, TextFieldsSizesClasses, TextFieldMessageClasses, type TextFieldProps, type TextFieldEmits } from './TextFieldConfig'
import styles from './TextField.module.css'

const emit = defineEmits<TextFieldEmits>()

const props = withDefaults(defineProps<TextFieldProps>(), {
  required: false,
})

const value = vModel(props, 'modelValue', emit, '')

const postTextElement = ref<HTMLElement>()
const preTextElement = ref<HTMLElement>()
const inputElement = ref<HTMLInputElement>()
const errorsListElement = ref<HTMLUListElement>()
const validationCtx = shallowRef<ValidationFieldContext>()

onMounted(() => {
  if (props.rules) {
    validationCtx.value = useFieldValidation({
      rules: props.rules,
      value: value,
      inputElement: inputElement.value,
      errorsListElement: errorsListElement.value,
    })
  }

  if (inputElement.value) {
    if (postTextElement.value) {
      inputElement.value.style.paddingRight = `${postTextElement.value.offsetWidth + 8}px`
    }

    if (preTextElement.value) {
      inputElement.value.style.paddingLeft = `${preTextElement.value.offsetWidth + 8}px`
    }
  }
})

const onTextChange = (e: Event) => {
  if (e.target instanceof (HTMLInputElement) || e.target instanceof (HTMLTextAreaElement)) {
    let _value = e.target.value
    if (props.formatter) {
      _value = props.formatter(_value)
    }

    value.value = _value
  }
}

const placeholder = computed(() => props.placeholder === undefined ? props.label : props.placeholder)

defineExpose({
  value,
  inputElement,
  errorsListElement,
  validate: () => validationCtx.value?.validate(),
})
</script>
