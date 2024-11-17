import { isString } from '@teranes/utils'
import type { TextFieldColor } from '@/components/text-field'
import ExcelFileIcon from '@/assets/images/excel-file.webp'
import WordFileIcon from '@/assets/images/word-file.webp'
import PdfFileIcon from '@/assets/images/pdf-file.webp'
import CsvFileIcon from '@/assets/images/csv-file.webp'
import TextFileIcon from '@/assets/images/txt-file.webp'
import FileIcon from '@/assets/images/file.webp'
import type { ValidationProps } from '@/functions/validation/ValidationConfig'

export type FileUploadProps<T = File | File[]> = ValidationProps<T> & {
  modelValue?: T
  thumbnailSize?: number
  maxFileSize?: number
  accept?: FileType
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

export type FileUploadEmits<T = File | File[]> = {
  'update:modelValue': [value: T]
}

export type FileItem = File & {
  sizeInKb: string
  dataUrl: string
}

export type FileType = 'image' | 'pdf' | 'csv' | 'doc' | 'excel' | 'text' | string[]

const fileTypes = {
  image: ['svg', 'webp', 'png', 'jpg', 'jpeg'],
  csv: ['csv'],
  pdf: ['pdf'],
  doc: ['doc', 'docx'],
  excel: ['xlsx'],
  text: ['txt'],
}

export function getFileType(type: FileType) {
  if (isString(type)) {
    return fileTypes[type] || type
  }

  return type
}

export async function getFileIcon(file: File) {
  const ext = getFileExtension(file)
  const type = Object.entries(fileTypes)?.find(([_, values]) => values.includes(ext))?.[0]

  switch (type) {
    case 'image':
      return imageFileToDataUrl(file)
    case 'csv':
      return imageToDataUrl(CsvFileIcon)
    case 'pdf':
      return imageToDataUrl(PdfFileIcon)
    case 'doc':
      return imageToDataUrl(WordFileIcon)
    case 'excel':
      return imageToDataUrl(ExcelFileIcon)
    case 'text':
      return imageToDataUrl(TextFileIcon)
    default:
      return imageToDataUrl(FileIcon)
  }
}

export function getFileExtension(file: File) {
  return file?.name?.split('.')?.slice(-1)?.[0] || 'Unknown'
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
