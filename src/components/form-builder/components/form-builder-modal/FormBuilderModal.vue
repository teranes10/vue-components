<script setup lang="ts" generic="T extends FormBuilderBase">
import type { FormBuilderBase } from '../../FormBuilderBase'
import type { FormBuilderModalConfirm, FormBuilderModalContext, FormBuilderModalEmits, FormBuilderModalProps } from './FormBuilderModelConfig'
import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { reactive, ref } from 'vue'
import FormBuilder from '../../FormBuilder.vue'
import styles from './FormBuilderModal.module.css'

const props = withDefaults(defineProps<FormBuilderModalProps<T>>(), {
  label: '',
  width: 650,
})

const emit = defineEmits<FormBuilderModalEmits<T>>()

const value = vModel(props, 'modelValue', emit)
const show = vModel(props, 'show', emit, false)

const formBuilderComponent = ref<ComponentType<typeof FormBuilder>>()

let createFormClass: () => void
let _onConfirm: FormBuilderModalConfirm<T> | undefined
const ctx: FormBuilderModalContext<T> = {
  create(FormClass, ...args) {
    createFormClass = () => {
      const formInput = reactive<T>(new FormClass(...args)) as T
      value.value = formInput as any
    }
  },
  assign(map) {
    if (!value.value) {
      createFormClass()
    }

    map && map(value.value)
  },
  reset() {
    formBuilderComponent.value?.reset()
  },
  open(onConfirm, map) {
    if (!value.value) {
      createFormClass()
    }

    show.value = true

    setTimeout(() => {
      if (map) {
        this.assign(map)
      }
    }, 250)

    _onConfirm = onConfirm
  },
  close() {
    show.value = false
    this.reset()

    _onConfirm = undefined
  },
}

async function onSave() {
  if (await formBuilderComponent.value?.validate()) {
    _onConfirm && _onConfirm(value.value)
    ctx.close()
  }
}

defineExpose({ ctx })
</script>

<template>
  <Modal v-model="show" :class="styles.formBuilderModal" :width="width" persistent>
    <template #header>
      {{ label }}
    </template>

    <FormBuilder v-if="!!value" ref="formBuilderComponent" v-model="value" />

    <template #footer>
      <div :class="styles.actionsContainer">
        <Button color="gray" text="Cancel" @press="() => show = false" />
        <Button color="primary" text="Save" @press="onSave" />
      </div>
    </template>
  </Modal>
</template>
