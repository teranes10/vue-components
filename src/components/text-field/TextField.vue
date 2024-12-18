<script setup lang="ts">
import type { ValidationFieldContext } from '@/functions/validation/ValidationConfig'
import { useFieldValidation } from '@/functions/validation/Validation'
import { Icon } from '@/shared/components/icon'
import { eventListener, vModel } from '@teranes/vue-composables'
import { X } from 'lucide'
import { computed, onMounted, ref, shallowRef } from 'vue'
import styles from './TextField.module.css'
import { TextFieldBorderClasses, type TextFieldEmits, TextFieldMessageClasses, type TextFieldProps, TextFieldsSizesClasses } from './TextFieldConfig'

const props = withDefaults(defineProps<TextFieldProps>(), {
  required: false,
  addTagOnEnter: true,
})

const emit = defineEmits<TextFieldEmits>()

const value = vModel(props, 'modelValue', emit, '')
const tags = vModel(props, 'tags', emit)

const placeholder = computed(() => props.placeholder === undefined ? props.label : props.placeholder)

const postTextElement = ref<HTMLElement>()
const preTextElement = ref<HTMLElement>()
const inputElement = ref<HTMLInputElement>()
const errorsListElement = ref<HTMLUListElement>()
const validationCtx = shallowRef<ValidationFieldContext>()

onMounted(() => {
  if (props.rules) {
    validationCtx.value = useFieldValidation({
      rules: props.rules,
      value,
      inputElement: inputElement.value,
      errorsListElement: errorsListElement.value,
    })
  }
})

function onTextChange(e: Event) {
  if (e.target instanceof (HTMLInputElement) || e.target instanceof (HTMLTextAreaElement)) {
    let _value = e.target.value
    if (props.formatter) {
      _value = props.formatter(_value)
    }

    value.value = _value
  }
}

if (Array.isArray(tags.value) && props.addTagOnEnter) {
  eventListener(inputElement, 'keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const tag = value.value.trim()
      if (tag) {
        addTag(tag)
        value.value = ''
      }
    }
  })
}

function addTag(value: string) {
  tags.value ??= []
  tags.value.push(value)
}

function removeTag(value: string) {
  const index = tags.value?.indexOf(value)
  if (index != null && index > -1) {
    tags.value?.splice(index, 1)
  }
}

defineExpose({
  value,
  inputElement,
  errorsListElement,
  validate: () => validationCtx.value?.validate(),
  addTag,
  removeTag,
})
</script>

<template>
  <label :class="styles.textField">
    <div v-if="label || tag" :class="styles.textFieldLabelContainer">
      <span v-if="label" :class="[styles.textFieldLabel, { [styles.required]: !!required }]" v-text="label" />
      <span v-if="tag" :class="styles.textFieldTag" v-text="tag" />
    </div>

    <div
      :class="[styles.textFieldContainer, {
        [TextFieldsSizesClasses[size!]]: !!size,
        [TextFieldBorderClasses[color!]]: !!color,
        [styles.disabled]: disabled,
        [styles.auto]: rows || tags,
        [styles.wrap]: tags,
      }]"
    >
      <div v-if="$slots.pre" ref="preTextElement" :class="styles.preText">
        <slot name="pre" />
      </div>

      <span v-for="tag in tags" :key="tag" :class="styles.inputTag">
        <span :class="styles.inputTagText" v-text="tag" />
        <Icon :class="styles.inputTagRemove" :icon="X" @click="removeTag(tag)" />
      </span>

      <textarea
        v-if="rows" ref="inputElement" :class="styles.textFieldInput" :placeholder="placeholder" :disabled="disabled" :value="value" :rows="rows" @input="onTextChange"
      />

      <input
        v-else ref="inputElement" :class="[styles.textFieldInput, {
          [TextFieldsSizesClasses[size!]]: !!size,
          [TextFieldBorderClasses[color!]]: !!color,
        }]" :placeholder="placeholder" :disabled="disabled" :value="value" @input="onTextChange"
      >

      <div v-if="$slots.post" ref="postTextElement" :class="styles.postText">
        <slot name="post" />
      </div>
    </div>

    <div v-if="helperText" :class="styles.textFieldHelperText" v-text="helperText" />

    <div
      v-if="message" :class="[styles.textFieldMessage, { [TextFieldMessageClasses[color!]]: !!color }]"
      v-text="message"
    />

    <ul ref="errorsListElement" :class="styles.textFieldErrorsContainer" />
  </label>
</template>
