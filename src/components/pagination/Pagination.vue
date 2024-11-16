<template>
  <ul :class="styles.pagination">
    <li
      :class="[styles.pageItem, { 'pointer-events-none': !hasFirstPage }]"
      @click="gotoFirstPage"
    >
      <a :class="styles.pageLink">
        <ChevronsLeft class="w-4 h-4" />
      </a>
    </li>
    <li
      :class="[styles.pageItem, { 'pointer-events-none': !hasPreviousPage }]"
      @click="gotoPreviousPage"
    >
      <a :class="styles.pageLink">
        <ChevronLeft class="w-4 h-4" />
      </a>
    </li>
    <li
      v-for="pageNumber in visiblePages"
      :key="pageNumber"
      :class="[styles.pageItem, { [styles.active]: pageNumber == page, 'pointer-events-none': pageNumber == '...' }]"
      @click="(typeof (pageNumber) === 'number') && gotoPage(pageNumber)"
    >
      <a :class="styles.pageLink">{{ pageNumber }}</a>
    </li>
    <li
      :class="[styles.pageItem, { 'pointer-events-none': !hasNextPage }]"
      @click="gotoNextPage"
    >
      <a :class="styles.pageLink">
        <ChevronRight class="w-4 h-4" />
      </a>
    </li>
    <li
      :class="[styles.pageItem, { 'pointer-events-none': !hasLastPage }]"
      @click="gotoLastPage"
    >
      <a :class="styles.pageLink">
        <ChevronsRight class="w-4 h-4" />
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { vModel } from '@teranes/vue-composables'
import type { PaginationEmits, PaginationProps } from './PaginationConfig'
import styles from './Pagination.module.css'

const emit = defineEmits<PaginationEmits>()

const props = withDefaults(defineProps<PaginationProps>(), {
  totalVisible: 9, // must be a odd number
})

const page = vModel(props, 'modelValue', emit, 1)

const visiblePages = computed(() => {
  let startPage = 1
  let endPage = props.totalPages

  if (props.totalPages > props.totalVisible) {
    const half = Math.floor(props.totalVisible / 2)
    if (page.value <= half) {
      endPage = props.totalVisible
    }
    else if (page.value + half >= props.totalPages) {
      startPage = props.totalPages - props.totalVisible + 1
    }
    else {
      startPage = page.value - half
      endPage = page.value + half
    }

    if (startPage > 1) {
      startPage += 2
    }

    if (endPage < props.totalPages) {
      endPage -= 2
    }
  }

  const pages: (number | string)[] = []

  if (startPage > 1) {
    pages.push(1, '...')
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < props.totalPages) {
    pages.push('...', props.totalPages)
  }

  return pages.length > 0 ? pages : [1]
})

const hasFirstPage = computed(() => page.value > 1)
const hasLastPage = computed(() => page.value < props.totalPages)
const hasNextPage = computed(() => page.value < props.totalPages)
const hasPreviousPage = computed(() => page.value > 1)

const gotoFirstPage = () => {
  page.value = 1
}

const gotoLastPage = () => {
  page.value = props.totalPages
}

const gotoPage = (pageNumber: number) => {
  page.value = pageNumber
}

const gotoNextPage = () => {
  page.value++
}

const gotoPreviousPage = () => {
  page.value--
}
</script>
