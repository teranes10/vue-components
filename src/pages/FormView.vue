<script setup lang="ts">
import type { Attribute } from '@/components'
import { FormBuilder, FormBuilderBase } from '@/components'
import { ref } from 'vue'

const types = { Char: 1, Varchar: 2, int: 3 }

const columnHeaders = [
  {
    text: 'Name',
    value: 'name',
    component: () => ({ _type: 'text' }),
  },
  {
    text: 'Type',
    value: 'type',
    component: () => ({ _type: 'select', items: types }),
  },
  {
    text: 'Size',
    value: 'size',
    component: () => ({ _type: 'number' }),
  },
  {
    text: 'Default',
    value: 'default',
    component: () => ({ _type: 'text' }),
  },
  {
    text: 'PK',
    value: 'primaryKey',
    component: () => ({ _type: 'switch' }),
  },
  {
    text: 'Nulls',
    value: 'allowNulls',
    component: () => ({ _type: 'switch' }),
  },
  {
    text: 'Unique',
    value: 'unique',
    component: () => ({ _type: 'switch' }),
  },
  {
    text: 'Identity',
    value: 'identity',
    component: () => ({ _type: 'switch' }),
  },
  {
    text: 'FK',
    value: 'foreignKey',
    component: () => ({ _type: 'switch' }),
  },
  { text: 'Reference Table', value: 'name' },
  { text: 'Reference Field', value: 'name' },
  { text: 'Relationship Type', value: 'name' },
]

const items = ref([
  {
    name: 'test',
    type: 'Varchar',
    size: 1,
    default: '',
  },
  {
    name: 'test',
    type: 'Varchar',
    size: 1,
    default: '',
  },
])

class TestForm extends FormBuilderBase {
  getAttributes(): Attribute[] {
    return [
      {
        _type: 'input',
        name: 'name',
        value: 'Name',
        type: 'text',
        props: { label: 'Name' },
        attrs: { size: 6 },
      },
      {
        _type: 'input',
        name: 'age',
        value: 123,
        type: 'number',
        props: { label: 'Age' },
        attrs: { size: 6 },
      },
      {
        _type: 'component',
        name: 'fields',
        type: 'table',
        props: {
          headers: columnHeaders,
          items: items.value,
          mobileView: 1125,
        },
        events: ['onUpdate:items'],
      },
    ]
  }

  onValueChanged(k: string, v: any) {
    console.error(k, v)
  }
}

const value = ref(new TestForm())

setTimeout(() => {
  items.value.push({} as any)
}, 10000)
</script>

<template>
  <FormBuilder v-model="value" />
</template>
