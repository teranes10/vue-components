<template>
  <Select ref="selectComponent" :items="pagination.items.value" v-bind="$attrs" :message="message">
    <template v-if="pagination.isLoading.value || pagination.isWaiting.value" #footer>
      <slot v-if="$slots.loading" name="loading" />
      <div v-else :class="styles.autocompleteLoading">
        <span>{{ pagination.isWaiting.value ? 'Waiting' : 'Fetching data' }} </span>
        <LoadingIcon icon="dots" class="autocomplete-loading-icon" />
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts" generic="T extends SelectItem">
import { useAttrs, ref, computed, getCurrentInstance, onMounted, watch } from 'vue'
import { debounce } from '@teranes/utils'
import { type ComponentType, vModel, infiniteScroll, pagination as usePagination, eventListener } from '@teranes/vue-composables'
import { LoadingIcon } from '../loading'
import type { AutocompleteEmits, AutocompleteProps, AutocompleteLoadOptions } from './AutocompleteConfig'
import type { SelectItem } from '../select/SelectConfig'
import Select from '../select/Select.vue'
import styles from './Autocomplete.module.css'

defineOptions({
  inheritAttrs: false,
})

const emit = defineEmits<AutocompleteEmits<T>>()

const props = withDefaults(defineProps<AutocompleteProps<T>>(), {
  visibleItems: 5,
})

const attrs = useAttrs()

const search = ref('')
const page = ref(1)

const itemsPerPage = vModel(props, 'itemsPerPage', emit, 10)
const items = vModel(props, 'items', emit, [])

const serverSideRendering = vModel(props, 'serverSideRendering')
if (getCurrentInstance()?.vnode.props?.onLoad) {
  serverSideRendering.value = true
}

const params = vModel(props, 'params')

const errorMessage = ref('')
const message = computed(() => !(pagination.isLoading.value || pagination.isWaiting.value) && !pagination.totalItems.value
  ? errorMessage.value || 'No items found.'
  : '')

const pagination = usePagination(items, page, itemsPerPage, (options) => {
  const _options: AutocompleteLoadOptions<T> = {
    ...options,
    callback: function (items: T[], totalItems: number): void {
      options.callback(items, totalItems)
      errorMessage.value = ''
    },
    error: function (message: string): void {
      options.callback([], 0)
      errorMessage.value = message || ''
    },
  }

  emit('load', _options)
}, { serverSideRendering, search, storePreviousItems: true, params })

const totalPages = computed(() => Math.ceil(pagination.totalItems.value / itemsPerPage.value))

const selectComponent = ref<ComponentType<typeof Select>>()
onMounted(() => {
  if (selectComponent.value) {
    const itemsContainerElement = selectComponent.value.$refs.itemsContainerElement
    if (itemsContainerElement) {
      infiniteScroll(itemsContainerElement, props.visibleItems, () => {
        if (page.value < totalPages.value) {
          page.value++
        }
      })
    }

    const textFieldComponent = selectComponent.value.textFieldComponent
    if (textFieldComponent) {
      watch(() => textFieldComponent.value, debounce((val) => {
        if (selectComponent.value?.isSearching) {
          search.value = val
        }
      }, 10))

      const inputElement = textFieldComponent.$refs.inputElement as HTMLInputElement
      if (inputElement) {
        inputElement.readOnly = false

        const toggleElement = selectComponent.value.$refs.referenceElement
        const toggleIcon = textFieldComponent.$refs.postText as HTMLElement

        if (toggleElement && toggleIcon) {
          eventListener([toggleElement, toggleIcon], 'click', (_, el) => {
            if (attrs?.disabled) {
              return
            }

            if (selectComponent.value) {
              if (el === toggleIcon) {
                selectComponent.value.toggle()
                selectComponent.value.isShowing ? inputElement.focus() : inputElement.blur()
              }
              else {
                selectComponent.value.show()
                inputElement.focus()
              }
            }
          })
        }
      }
    }
  }
})
</script>
