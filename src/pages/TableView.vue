<script setup>
import { Button, FormBuilderBase, FormBuilderModal, Table, useFormBuilderModalInitializer, useInputView } from '@/components'
import { Group } from '@/shared/components/group'
import { debounce } from '@teranes/utils'
import { Plus, Trash2 } from 'lucide'
import { h, ref } from 'vue'

const sqlTypes = { 'Char': { value: 1, group: -1 }, 'Varchar': { value: 2, group: -1 }, 'Tiny Text': { value: 3, group: 4 }, 'Text': { value: 4, group: -1 }, 'Medium Text': { value: 5, group: 4 }, 'Long Text': { value: 6, group: 4 }, 'Tiny Int': { value: 7, group: 10 }, 'Small Int': { value: 8, group: 10 }, 'Medium Int': { value: 9, group: 10 }, 'Int': { value: 10, group: -1 }, 'Big Int': { value: 11, group: 10 }, 'Float': { value: 12, group: -1 }, 'Double': { value: 13, group: -1 }, 'Decimal': { value: 14, group: -1 }, 'Year': { value: 15, group: -1 }, 'Date': { value: 16, group: -1 }, 'Time': { value: 17, group: -1 }, 'Date Time': { value: 18, group: -1 }, 'Timestamp': { value: 19, group: -1 }, 'Json': { value: 20, group: -1 }, 'Tiny Blob': { value: 21, group: 22 }, 'Blob': { value: 22, group: -1 }, 'Medium Blob': { value: 23, group: 22 }, 'Long Blob': { value: 24, group: 22 } }
const sqlConstraints = { 'Not Null': 1, 'Unique': 2, 'Primary Key': 3, 'Auto Increment': 4, 'Foreign Key': 5 }
const sqlRelationships = { 'One To One': 1, 'One To Many': 2, 'Many To Many': 3, 'Many To One': 4 }
const sqlTypesMap = new Map()

function getSqlTypesByGroup(group) {
  let values = sqlTypesMap.get(group)
  if (!values) {
    values = Object.fromEntries(Object.entries(sqlTypes).filter(([_k, v]) => v.group === group || v.value === group))
    sqlTypesMap.set(group, values)
  }

  return values
}

const mainSqlTypes = getSqlTypesByGroup(-1)

function vModel(key, h) {
  return {
    'modelValue': h.getValue(key),
    'onUpdate:modelValue': debounce((v) => { h.setValue(key, v) }, 1000),
  }
}

function hType(x, y) {
  const items = [useInputView('select', { placeholder: 'Type', items: mainSqlTypes, ...vModel('type', y) })]
  const subTypes = getSqlTypesByGroup(x.type?.value)
  if (Object.keys(subTypes).length > 1) {
    if (!x.subType) {
      y.setValue('subType', x.type)
    }
    items.push(useInputView('select', { placeholder: 'Sub Type', items: subTypes, ...vModel('subType', y) }))
  }
  if ([1, 2].includes(x.type?.value)) {
    items.push(useInputView('number', { placeholder: 'Size', ...vModel('size', y) }))
  }
  if (x.type?.value === 14) {
    items.push(useInputView('number', { placeholder: 'Precision', ...vModel('precision', y) }))
    items.push(useInputView('number', { placeholder: 'Scale', ...vModel('scale', y) }))
  }
  return h(Group, { flex: [2, 1] }, () => items)
}

const columnHeaders = [
  {
    component: (x, y) => h(Group, { justify: 'center' }, () => [
      h(Button, { type: 'icon', icon: Plus, color: 'success', onPress: () => addNewColumn(x, y) }),
      h(Button, { type: 'icon', icon: Trash2, color: 'danger', onPress: () => removeColumn(x, y) }),
    ]),
    headerComponent: () => h(Button, { type: 'icon', icon: Plus, color: 'success', onPress: () => addNewColumn() }),
  },
  {
    text: 'Name',
    value: 'name',
    component: _x => ({ _type: 'text' }),
    width: 200,
  },
  {
    text: 'Type',
    component: hType,
  },
  {
    text: 'Constraints',
    value: 'constraints',
    component: _x => ({ _type: 'select', items: sqlConstraints, multiple: true }),
  },
  {
    text: 'Default',
    value: 'default',
    component: _x => ({ _type: 'text' }),
  },
  {
    text: 'Reference Table',
    value: 'reference.table',
    component: x => x.constraints?.includes(5)
      ? ({ _type: 'select', items: entities.value, itemText: 'name', itemValue: 'name' })
      : ({}),
  },
  {
    text: 'Reference Field',
    value: 'reference.column',
    component: x => x.reference?.table
      ? ({ _type: 'select', items: entityMap.value.get(x.reference.table)?.columns || [], itemText: 'name', itemValue: 'name' })
      : ({}),
  },
  {
    text: 'Relationship Type',
    value: 'reference.relationship',
    component: x => x.reference?.column ? ({ _type: 'select', items: sqlRelationships }) : ({}),
  },
  {
    text: 'Name',
    value: 'name',
  },
]

const columns = ref([
  {
    name: 'id',
    type: { value: 10 },
    constraints: [1, 3, 4],
  },
])

function addNewColumn(x, y) {
  const index = y?.index != null ? y.index + 1 : 0
  columns.value.splice(index, 0, {})
}

function removeColumn(x, y) {
  const index = y?.index != null ? y.index : -1
  if (index > -1)
    columns.value.splice(index, 1)
}
</script>

<template>
  <Table resizable :headers="columnHeaders" :items="columns" />
</template>
