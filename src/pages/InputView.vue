<script setup lang="ts">
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
import { Home } from 'lucide'
</script>

<template>
  <!-- <TextField size="lg" :tags="['name 1', 'name 2', 'name 3', 'name 4']" /> -->
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

  <Select label="Select" />

  <Autocomplete label="Autocomplete" />

  <DatePicker label="Date Picker" />

  <FileUpload label="Icon" />

  <RadioGroup label="Radio Group">
    <RadioButton label="Item 1" />
    <RadioButton label="Item 2" />
    <RadioButton label="Item 3" />
  </RadioGroup>

  <CheckboxGroup label="Checkbox Group">
    <Checkbox label="Item 1" />
    <Checkbox label="Item 2" />
    <Checkbox label="Item 3" />
  </CheckboxGroup>

  <Switch label="Switch" />
</template>
