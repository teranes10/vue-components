import type { TextFieldColor } from '@/components/text-field'
import type { ValidationProps } from '@/functions/validation/ValidationConfig'
import type { IconProps } from '@/shared/components/icon'

export type FileUploadProps<T = File | File[]> = ValidationProps<T> & {
  modelValue?: T
  thumbnailSize?: number
  maxFileSize?: number
  accept?: FileType | string[]
  multiple?: boolean
  label?: string
  tag?: string
  color?: TextFieldColor
  helperText?: string
  message?: string
  rounded?: boolean
  disabled?: boolean
  required?: boolean
}

export interface FileUploadEmits<T = File | File[]> {
  'update:modelValue': [value: T]
}

export type FileType = 'image' | 'pdf' | 'csv' | 'doc' | 'excel' | 'text' | 'unknown'

export type FileIconInfo = IconProps

export type FileItem = File & {
  fileType: FileType
  sizeInKb: string
  dataUrl?: string
  icon?: FileIconInfo
}

export const fileTypes: Record<FileType, string[]> = {
  image: ['svg', 'webp', 'png', 'jpg', 'jpeg'],
  csv: ['csv'],
  pdf: ['pdf'],
  doc: ['doc', 'docx'],
  excel: ['xlsx'],
  text: ['txt'],
  unknown: [],
}

export const fileTypeIconInfo: Record<FileType, FileIconInfo> = {
  image: { icon: 'FileImage', color: '#41d3b0' },
  csv: { icon: 'File', text: 'CSV', color: '#41d3b0' },
  excel: { icon: 'File', text: 'Excel', color: '#41d3b0' },
  pdf: { icon: 'File', text: 'PDF', color: '#f2786c' },
  doc: { icon: 'File', text: 'Doc', color: '#48b7ee' },
  text: { icon: 'FileText', color: '#48b7ee' },
  unknown: { icon: 'File', color: '#475070' },
}

export function getFileTypeByExt(file: File) {
  const ext = getFileExtension(file)
  return (Object.entries(fileTypes)?.find(([_, values]) => values.includes(ext))?.[0] || 'unknown') as FileType
}

export function getFileExtension(file: File) {
  return file?.name?.split('.')?.slice(-1)?.[0] || 'unknown'
}

export function imageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = function () {
      resolve(reader.result as string)
    }

    reader.onerror = function () {
      resolve('')
    }

    reader.readAsDataURL(file)
  })
}

export function imageToDataUrl(src: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    const img = new Image()

    img.onload = () => {
      if (document) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        resolve(canvas.toDataURL('image/png'))
        canvas.remove()
      }
      else {
        resolve('')
      }
    }

    img.onerror = () => {
      resolve('')
    }

    img.src = src
  })
}
