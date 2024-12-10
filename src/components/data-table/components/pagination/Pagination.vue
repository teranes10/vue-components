<script setup lang="ts">
import type { PaginationEmits, PaginationProps } from './PaginationConfig'
import { Icon } from '@/shared/components/icon'
import { vModel } from '@teranes/vue-composables'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide'
import { computed } from 'vue'
import styles from './Pagination.module.css'

const props = withDefaults(defineProps<PaginationProps>(), {
  totalVisible: 9, // must be a odd number
})

const emit = defineEmits<PaginationEmits>()

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

function gotoFirstPage() {
  page.value = 1
}

function gotoLastPage() {
  page.value = props.totalPages
}

function gotoPage(pageNumber: number) {
  page.value = pageNumber
}

function gotoNextPage() {
  page.value++
}

function gotoPreviousPage() {
  page.value--
}
</script>

<template>
  <ul :class="styles.pagination">
    <li :class="[styles.pageItem, { [styles.disable]: !hasFirstPage }]" @click="gotoFirstPage">
      <a :class="styles.pageLink">
        <Icon :icon="ChevronsLeft" :class="styles.icon" />
      </a>
    </li>
    <li :class="[styles.pageItem, { [styles.disable]: !hasPreviousPage }]" @click="gotoPreviousPage">
      <a :class="styles.pageLink">
        <Icon :icon="ChevronLeft" :class="styles.icon" />
      </a>
    </li>
    <li
      v-for="pageNumber in visiblePages" :key="pageNumber"
      :class="[styles.pageItem, { [styles.active]: pageNumber === page, [styles.disable]: pageNumber === '...' }]"
      @click="(typeof (pageNumber) === 'number') && gotoPage(pageNumber)"
    >
      <a :class="styles.pageLink">{{ pageNumber }}</a>
    </li>
    <li :class="[styles.pageItem, { [styles.disable]: !hasNextPage }]" @click="gotoNextPage">
      <a :class="styles.pageLink">
        <Icon :icon="ChevronRight" :class="styles.icon" />
      </a>
    </li>
    <li :class="[styles.pageItem, { [styles.disable]: !hasLastPage }]" @click="gotoLastPage">
      <a :class="styles.pageLink">
        <Icon :icon="ChevronsRight" :class="styles.icon" />
      </a>
    </li>
  </ul>
</template>
