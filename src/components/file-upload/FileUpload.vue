<template>
  <label :class="styles.fileInput">
    <div v-if="label || tag" class="file-input-label-container">
      <span v-if="label" :class="{ 'file-input-label': true, 'required': !!required }" v-text="label" />
      <span v-if="tag" class="file-input-tag" v-text="tag" />
    </div>

    <div ref="fileInputContainerElement" class="file-input-main-container" @dragover.prevent @drop.prevent>
      <div class="file-input-container">
        <div v-for="(item, i) in uploadedFiles" :key="i" class="file-item-container">
          <div class="file-item">
            <img class="thumbnail" :src="item.dataUrl" alt="File" draggable="false">
            <div class="overlay">
              <div class="mt-3">{{ item.sizeInKb }} KB</div>
              <div class="text-container">
                <div class="text">{{ item.name }}</div>
              </div>
              <XCircleIcon class="remove-btn" @click="(e) => remove(e, i)" />
            </div>
          </div>
        </div>

        <div class="file-dropzone" @drop="onFileDropped">
          <UploadCloudIcon class="icon" />
          <h2 class="text">
            Drag and drop or
            <span class="text-active" @click="browseForFiles">browse</span> your files
          </h2>
        </div>

        <input ref="fileInputElement" type="file" :multiple="multiple" style="display: none" :disabled="disabled"
          @change="onFileSelected">
      </div>
    </div>

    <div v-if="helperText" class="file-input-helper-text" v-text="helperText" />

    <div v-if="message" class="file-input-message" v-text="message" />

    <ul ref="errorsListElement" class="list-disc list-inside text-left" />
  </label>
</template>

<script setup lang="ts">
import { XCircleIcon, UploadCloudIcon } from 'lucide-vue-next'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { isString } from '@teranes/utils'
import type { ValidationFieldContext } from '../../functions/validation/ValidationConfig'
import { useFieldValidation } from '../../functions/validation/Validation'
import { useToast } from '../toast'
import { getFileType, getFileIcon, getFileExtension } from './FileUploadConfig'
import type { FileItem, FileUploadEmits, FileUploadProps } from './FileUploadConfig'
import styles from './FileUpload.module.css'

const props = withDefaults(defineProps<FileUploadProps>(), {
  accept: () => [],
  multiple: false,
  thumbnailSize: 75,
  maxFileSize: 10,
  disabled: false,
})

const emit = defineEmits<FileUploadEmits>()

const iconSize = computed(() => `${props.thumbnailSize}px`)

const value = vModel(props, 'modelValue', emit)

const uploadedFiles = ref<FileItem[]>([])
watch(uploadedFiles, (files) => {
  if (props.multiple) {
    value.value = files
  }
  else {
    value.value = files?.[0]
  }
}, { deep: true })

const fileInputElement = ref<HTMLInputElement>()
const fileInputContainerElement = ref<HTMLDivElement>()
const errorsListElement = ref<HTMLUListElement>()
const validationCtx = shallowRef<ValidationFieldContext>()
onMounted(() => {
  if (props.rules) {
    validationCtx.value = useFieldValidation({
      rules: props.rules,
      value,
      inputContainer: fileInputContainerElement.value,
      errorsListElement: errorsListElement.value,
    })
  }
})

function browseForFiles(e: Event) {
  e.preventDefault()

  if (fileInputElement.value) {
    fileInputElement.value.click()
  }
}

function onFileDropped(e: DragEvent) {
  const files = Array.from(e.dataTransfer?.files || [])
  loadFiles(files)
}

function onFileSelected(e: Event) {
  const el = e.target as HTMLInputElement
  const files = Array.from(el.files || [])
  loadFiles(files)
}

function remove(e: Event, index: number) {
  e.preventDefault()
  uploadedFiles.value.splice(index, 1)
}

async function loadFiles(files: File[]) {
  if (!props.multiple) {
    if (files.length > 1) {
      files = [files[0]]
      useToast('Only one file is accepted.', { type: 'warning' })
    }
  }

  const _files: FileItem[] = []

  for (const file of files) {
    const valid = validateFile(file)
    if (isString(valid)) {
      useToast(valid, { type: 'danger' })
      continue
    }

    const _file = file as FileItem
    _file.sizeInKb = (file.size / 1000).toFixed(1)
    _file.dataUrl = (await getFileIcon(file)) || ''

    _files.push(_file)
  }

  if (_files.length > 0) {
    if (props.multiple) {
      uploadedFiles.value.push(..._files)
    }
    else {
      uploadedFiles.value = _files
    }
  }
}

function validateFile(file: File): boolean | string {
  if (props.maxFileSize < (file.size / (1000 * 1000))) {
    return `File size must be less than ${props.maxFileSize} MB`
  }

  const ext = getFileExtension(file)
  const acceptableTypes = getFileType(props.accept)

  if ((acceptableTypes && acceptableTypes.length > 0) && !acceptableTypes.includes(ext)) {
    return `File type must be in [${acceptableTypes.join(', ')}]`
  }

  return true
}
</script>

<style>
.file-input {
  --file-input-icon-size: v-bind(iconSize);
}
</style>
