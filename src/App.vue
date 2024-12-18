<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDeleteAlert, useLoading } from './components'
import Autocomplete from './components/autocomplete/Autocomplete.vue'
import Button from './components/button/Button.vue'
import Select from './components/select/Select.vue'
import TextField from './components/text-field/TextField.vue'

const selectValue = ref([1])
const autocompleteValue = ref([1])
type Item = {
  text: string
  value: number
}
const items = ref<Item[]>([{ text: 'Item 1', value: 1 }, { text: 'Item 2', value: 2 }, { text: 'Item 3', value: 3 }])

function onChange(v: any) {
  console.log('change', v)
}

function onPress() {
  const loading = useLoading()
  setTimeout(() => {
    loading.hide()
  }, 5000)
}
</script>

<template>
  <Button text="Btn" @press="onPress" />
  <div style="width: 370px;">
    <Select

      :items="items"
      multiple
      label="Select"
      @update:model-value="onChange"
    />

    <Autocomplete

      multiple
      :items="items"
      label="Autocomplete"
      @update:model-value="onChange"
    />
  </div>
</template>
