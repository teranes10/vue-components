<script setup lang="ts" generic="T extends FormBuilderBase">
import type { Attribute, FormBuilderBase, FormBuilderMapper } from './FormBuilderBase'
import { Element } from '@/components/element'
import { Input } from '@/components/input'
import { useFormValidation } from '@/functions/validation/Validation'
import { cloneDeep, objectAssign, setValueByObjectPath } from '@teranes/utils'
import { vModel } from '@teranes/vue-composables'
import { computed, inject, provide } from 'vue'
import styles from './FormBuilder.module.css'
import { type FormBuilderContext, FormBuilderContextKey, type FormBuilderEmits, type FormBuilderProps, getFieldClasses, getPropsToWatch } from './FormBuilderConfig'

const props = withDefaults(defineProps<FormBuilderProps<T>>(), {

})

const emit = defineEmits<FormBuilderEmits<T>>()

const editedItem = vModel(props, 'modelValue', emit)

function canShow(item: any): boolean {
  return item?.showIf ? item.showIf(editedItem.value._item) : true
}

const ctx = inject<FormBuilderContext>(FormBuilderContextKey, {
  propsToWatch: {},
  userEditedFields: new Set(),
  onValueUpdate(fieldPath, value, programmaticallyChanged) {
    const item = editedItem.value._item as T
    if (!programmaticallyChanged) {
      this.userEditedFields.add(fieldPath)
    }
    setValueByObjectPath(item, fieldPath, value)
    watchValues(fieldPath)
    item?.onValueChanged(fieldPath, value)
  },
  setPropsToWatch(propsToWatch) {
    Object.keys(propsToWatch).forEach((prop) => {
      if (this.propsToWatch[prop]) {
        this.propsToWatch[prop].push(...propsToWatch[prop])
      }
      else {
        this.propsToWatch[prop] = propsToWatch[prop]
      }
    })
  },
})

function watchValues(prop: string) {
  const item = editedItem.value._item
  ctx.propsToWatch[prop]?.forEach(({ watcherProp, setter, disableWatcherAfterUserEdit, userChangesOnly }) => {
    if (!(disableWatcherAfterUserEdit && ctx.userEditedFields.has(watcherProp))) {
      setValueByObjectPath(item, watcherProp, setter(item))
      if (!userChangesOnly) {
        watchValues(watcherProp)
      }
    }
  })
}

provide(FormBuilderContextKey, ctx)

const defaultValue: any = editedItem.value?.getValue()

const elements = computed<Attribute[]>(() => editedItem.value?.getAttributes ? cloneDeep(editedItem.value.getAttributes()) : [])

const fields = computed(() => elements.value?.filter(x => x._type === 'input') || []);
(function updateInitialValues() {
  for (const field of fields.value) {
    const value = field.value
    if (value != null) {
      ctx.onValueUpdate(getFieldNamePath(field.name), value, true)
    }
  }
})()

ctx.setPropsToWatch(getPropsToWatch(fields.value, props.group))

function getFieldNamePath(name: string) {
  return props.group ? `${props.group}.${name}` : name
}

function reset() {
  editedItem.value = objectAssign(editedItem.value, defaultValue)
}

function assign(map: FormBuilderMapper<T>) {
  map(editedItem.value)
}

const validationForm = useFormValidation()

function getComponentEvents(el: any) {
  if (!el || !el.events?.length) {
    return {}
  }

  const events: any = {}

  for (const event of el.events) {
    events[event] = (...args: any[]) => {
      el?.props[event]?.(...args)

      const _args = cloneDeep(args)

      if (typeof el.value === 'function') {
        if (el.events.length > 1) {
          el.value(el.name, ..._args)
        }
        else {
          el.value(..._args)
        }
      }
      else {
        ctx.onValueUpdate(getFieldNamePath(el.name), _args[0], true)
      }
    }
  }

  return events
}

defineExpose({ reset, assign, validate: validationForm?.validate })
</script>

<template>
  <div :class="styles.formBuilder">
    <div v-if="label" :class="styles.label">
      {{ label }}
    </div>
    <div :class="styles.container">
      <template v-for="element in elements">
        <div v-if="canShow(element)" :key="element.name" :class="getFieldClasses(element.attrs)">
          <FormBuilder
            v-if="element._type === 'group'" v-model="element.value" :label="element.label"
            :group="getFieldNamePath(element.name)"
          />

          <Input
            v-else-if="element._type === 'input'" :type="element.type"
            :props="{ modelValue: element.value, ...element.props }"
            @update:model-value="(val: any) => ctx.onValueUpdate(getFieldNamePath(element.name), val)"
          />

          <Element
            v-else-if="element._type === 'component'" :type="element.type"
            :props="{ ...element.props, ...getComponentEvents(element) }"
          />
        </div>
      </template>
    </div>
  </div>
</template>
