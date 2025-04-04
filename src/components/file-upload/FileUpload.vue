<script setup lang="ts">
import type { ValidationFieldContext } from '@/functions/validation/ValidationConfig'
import type { FileItem, FileUploadEmits, FileUploadProps } from './FileUploadConfig'
import { useToast } from '@/components/toast'
import { useFieldValidation } from '@/functions/validation/Validation'
import { Icon } from '@/shared/components/icon'
import { isString } from '@teranes/utils'
import { vModel } from '@teranes/vue-composables'
import { UploadCloud, XCircle } from 'lucide'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import styles from './FileUpload.module.css'
import { fileTypeIconInfo, fileTypes, getFileExtension, getFileTypeByExt, imageFileToDataUrl } from './FileUploadConfig'

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
    _file.fileType = getFileTypeByExt(file)
    _file.icon = fileTypeIconInfo[_file.fileType]
    _file.sizeInKb = (file.size / 1000).toFixed(1)
    _file.dataUrl = _file.fileType === 'image' ? await imageFileToDataUrl(file) : undefined

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
  const acceptableTypes = Array.isArray(props.accept) ? props.accept : fileTypes[props.accept]

  if ((acceptableTypes && acceptableTypes.length > 0) && !acceptableTypes.includes(ext)) {
    return `File type must be in [${acceptableTypes.join(', ')}]`
  }

  return true
}
</script>

<template>
  <label :class="styles.fileInput">
    <div v-if="label || tag" :class="styles.fileInputLabelContainer">
      <span v-if="label" :class="[styles.fileInputLabel, { [styles.required]: !!required }]" v-text="label" />
      <span v-if="tag" :class="styles.fileInputTag" v-text="tag" />
    </div>

    <div
      ref="fileInputContainerElement" :class="[styles.fileInputMainContainer, { [styles.disabled]: disabled }]"
      @dragover.prevent @drop.prevent
    >
      <div :class="styles.fileInputContainer">
        <div v-for="(item, i) in uploadedFiles" :key="item.name" :class="styles.fileItemContainer">
          <div :class="styles.fileItem">
            <img v-if="item.dataUrl" :class="styles.thumbnail" :src="item.dataUrl" alt="File" draggable="false">
            <Icon v-else v-bind="item.icon" stroke-width="1" :class="styles.thumbnail" />

            <div :class="styles.overlay">
              <div :class="styles.fileInfo">
                <div :class="styles.fileSize">{{ item.sizeInKb }} KB</div>
                <div :class="styles.textContainer">
                  <div :class="styles.fileName">{{ item.name }}</div>
                </div>
              </div>
              <Icon :icon="XCircle" :class="styles.removeBtn" @click="(e) => remove(e, i)" />
            </div>
          </div>
        </div>

        <div :class="styles.fileDropzone" @drop="onFileDropped">
          <Icon :icon="UploadCloud" :class="styles.icon" />
          <h2 :class="styles.text">
            Drag and drop or
            <span :class="styles.textActive" @click="browseForFiles">browse</span> your files
          </h2>
        </div>

        <input
          ref="fileInputElement" type="file" :multiple="multiple" style="display: none" :disabled="disabled"
          @change="onFileSelected"
        >
      </div>
    </div>

    <div v-if="helperText" :class="styles.fileInputHelperText" v-text="helperText" />
    <div v-if="message" :class="styles.fileInputMessage" v-text="message" />

    <ul ref="errorsListElement" :class="styles.fileInputErrorContainer" />
  </label>
</template>

<style>
.file-input {
  --file-input-icon-size: v-bind(iconSize);
}
</style>
