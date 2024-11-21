<template>
  <div>
    <Modal :class="styles.formBuilderModal" v-model="show" :width="width" persistent>
      <template #header>
        {{ label }}
      </template>

      <FormBuilder v-if="!!value" ref="formBuilderComponent" v-model="value" />

      <template #footer>
        <div :class="styles.actionsContainer">
          <Button color="gray" text="Cancel" @click="() => show = false" />
          <Button color="primary" text="Save" @click="onSave" />
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts" generic="T extends FormBuilderBase">
import { reactive, ref } from 'vue'
import { type ComponentType, vModel } from '@teranes/vue-composables'
import { Modal } from '@/components/modal'
import { Button } from '@/components/button'
import FormBuilder from '../../FormBuilder.vue'
import type { FormBuilderBase } from '../../FormBuilderBase'
import type { FormBuilderModalEmits, FormBuilderModalProps, FormBuilderModalContext, FormBuilderModalConfirm } from './FormBuilderModelConfig'
import styles from './FormBuilderModal.module.css'

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<FormBuilderModalEmits<T>>()

const props = withDefaults(defineProps<FormBuilderModalProps<T>>(), {
  label: '',
  width: 650,
})

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

const onSave = async () => {
  if (await formBuilderComponent.value?.validate()) {
    _onConfirm && _onConfirm(value.value)
    ctx.close()
  }
}

defineExpose({ ctx })
</script>
