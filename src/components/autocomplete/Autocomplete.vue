<script setup lang="ts" generic="T extends object, V, K extends Key">
import type { Key } from '@/functions/item/ItemKey'
import { LoadingIcon } from '@/components/loading'
import Select from '@/components/select/Select.vue'
import { type ComponentType, infiniteScroll, pagination as usePagination, vModel } from '@teranes/vue-composables'
import { computed, onMounted, ref, watch } from 'vue'
import styles from './Autocomplete.module.css'
import { type AutocompleteEmits, type AutocompleteLoadOptions, type AutocompleteProps, extractSelectProps } from './AutocompleteConfig'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AutocompleteProps<T, V, K>>(), {
  items: () => [],
  itemsPerPage: 10,
  visibleItems: 5,
})

const emit = defineEmits<AutocompleteEmits<T, V>>()

const selectProps = computed(() => extractSelectProps(props))

const modelValue = vModel(props, 'modelValue', emit)

const search = ref('')
const page = ref(1)
const itemsPerPage = vModel(props, 'itemsPerPage', emit)
const serverSideRendering = vModel(props, 'serverSideRendering')
const items = vModel(props, 'items', emit)
const params = vModel(props, 'params')
const errorMessage = ref('')

if (props.onLoad) {
  serverSideRendering.value = true
}

const pagination = usePagination(items, page, itemsPerPage, (options) => {
  const _options: AutocompleteLoadOptions<T> = {
    ...options,
    callback(items: T[], totalItems: number): void {
      options.callback(items, totalItems)
      errorMessage.value = ''
    },
    error(message: string): void {
      options.callback([], 0)
      errorMessage.value = message || ''
    },
  }

  props.onLoad?.(_options)
}, { serverSideRendering, search, storePreviousItems: true, params })

const footerMessage = computed(() => !(pagination.isLoading.value || pagination.isWaiting.value) && !pagination.totalItems.value
  ? errorMessage.value || 'No items found.'
  : '',
)

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

    watch(() => selectComponent.value?.search, (v) => {
      search.value = v || ''
    })
  }
})
</script>

<template>
  <Select ref="selectComponent" v-model="modelValue" :filterable="false" :items="pagination.items.value" :footer-message="footerMessage" v-bind="{ ...selectProps, ...$attrs }">
    <template v-if="pagination.isLoading.value || pagination.isWaiting.value" #footer>
      <slot v-if="$slots.loading" name="loading" />
      <div v-else :class="styles.autocompleteLoading">
        <span>{{ pagination.isWaiting.value ? 'Waiting' : 'Fetching data' }} </span>
        <LoadingIcon icon="dots" :class="styles.autocompleteLoadingIcon" />
      </div>
    </template>
  </Select>
</template>
