<script setup lang="ts">
import type { ButtonType } from '@/components/button/ButtonConfig'
import Autocomplete from '@/components/autocomplete/Autocomplete.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import CheckboxGroup from '@/components/checkbox/components/CheckboxGroup.vue'
import CurrencyField from '@/components/currency-field/CurrencyField.vue'
import DatePicker from '@/components/date-picker/DatePicker.vue'
import FileUpload from '@/components/file-upload/FileUpload.vue'
import NumberField from '@/components/number-field/NumberField.vue'
import RadioGroup from '@/components/radio-button/components/RadioGroup.vue'
import RadioButton from '@/components/radio-button/RadioButton.vue'
import Select from '@/components/select/Select.vue'
import Switch from '@/components/switch/Switch.vue'
import TextField from '@/components/text-field/TextField.vue'
import Icon from '@/shared/components/icon/Icon.vue'
import { Home } from 'lucide'
import { ref, watch } from 'vue'

const select = ref()

const items = [
  { text: 'Selection Item 1', value: 1 },
  { text: 'Selection Item 2', value: 2 },
  {
    text: 'Selection Item 3',
    value: 3,
    items: [
      { text: 'Sub Selection Item 1', value: 31, items: [{ text: 'Sub Sub Selection Item 1', value: 311 }] },
      { text: 'Sub Selection Item 2', value: 32, items: [{ text: 'Sub Sub Selection Item 1', value: 321 }] },
    ],
  },
]

const radio = ref('Item 2')

watch(select, (v) => {
  console.error('select', v)
})
</script>

<template>
  <TextField size="sm" :tags="['name 1', 'name 2', 'name 3', 'name 4']" />

  <TextField label="Test Label" :tags="['name 1', 'name 2', 'name 3', 'name 4']" :add-tag-on-enter="false">
    <template #pre>
      <Icon :icon="Home" />
    </template>
    <template #post>
      <Icon :icon="Home" />
    </template>
  </TextField>

  <TextField label="Text Field" />

  <NumberField label="Number Field" />

  <CurrencyField label="Currency Field" />

  <Select v-model="select" multi-level label="Select" :items="items" />

  <Autocomplete label="Autocomplete" :items="items" />

  <DatePicker label="Date Picker" />

  <FileUpload label="Icon" />

  <RadioGroup v-for="type in ['fill', 'outline', 'outline-fill', 'text', 'text-fill', 'boxed']" :key="type" v-model="radio" :label="`Radio Group ${type}`" size="sm" color="danger" :type="type as ButtonType">
    <RadioButton label="Item 1" />
    <RadioButton label="Item 2" />
    <RadioButton label="Item 3" />
  </RadioGroup>

  <RadioGroup v-model="radio" label="Radio Group" size="sm" color="danger">
    <RadioButton label="Item 1" />
    <RadioButton label="Item 2" />
    <RadioButton label="Item 3" />
  </RadioGroup>

  <CheckboxGroup label="Checkbox Group" size="sm" color="danger">
    <Checkbox label="Item 1" />
    <Checkbox label="Item 2" />
    <Checkbox label="Item 3" />
  </CheckboxGroup>

  <Switch label="Switch" size="sm" color="danger" />
</template>
