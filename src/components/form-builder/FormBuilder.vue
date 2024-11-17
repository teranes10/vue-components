<template>
  <div class="px-5 py-7 border rounded-md border-slate-200/60 dark:border-darkmode-400">
    <div v-if="label"
      class="flex items-center pt-1 pb-2 font-medium border-b border-slate-200/60 dark:border-darkmode-400">
      {{ label }}
    </div>
    <div :class="['grid gap-x-2 gap-y-4', { 'mt-5': !!label }]">
      <template v-for="element in elements">
        <div v-if="canShow(element)" :key="element.name" :class="getFieldClasses(element.attrs)">
          <FormBuilder v-if="element._type === 'group'" v-model="element.value" :label="element.label"
            :group="getFieldNamePath(element.name)" />

          <Button v-else-if="element._type === 'button'" v-bind="{ ...element.props }"
            @click="element.onClick(editedItem)" />

          <InputWidget v-else-if="element._type === 'input'"
            v-bind="{ type: element.type, props: { modelValue: element.value, ...element.props } }"
            @update:model-value="(val: any) => ctx.onValueUpdate(getFieldNamePath(element.name), val)" />

          <InputWidget v-else-if="element._type === 'component'"
            v-bind="{ type: element.type, props: { ...element.props, ...getComponentEvents(element) } }" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends FormBuilderBase">
import { computed, inject, provide } from 'vue'
import { vModel } from '@teranes/vue-composables'
import { setValueByObjectPath, getAccessedProps, objectAssign, cloneDeep } from '@teranes/utils'
import { InputWidget } from '@/components/input-widget'
import { useFormValidation } from '@/functions/validation/Validation'
import type { FormBuilderBase, FormBuilderMapper } from './FormBuilderBase'
import { type FormBuilderProps, type FormBuilderEmits, type FormBuilderContext, type FormBuilderPropsToWatch, SmFormFieldSizeClasses, MdFormFieldSizeClasses, LgFormFieldSizeClasses, FormBuilderContextKey, type FormFieldSize } from './FormBuilderConfig'

const emit = defineEmits<FormBuilderEmits<T>>()

const props = withDefaults(defineProps<FormBuilderProps<T>>(), {

})

const getSizeClass = (size: FormFieldSize) => {
  if (size && typeof size === 'object') {
    return {
      [SmFormFieldSizeClasses[size.sm || 12]]: true,
      [MdFormFieldSizeClasses[size.md || 12]]: true,
      [LgFormFieldSizeClasses[size.lg || 12]]: true,
    }
  }

  return {
    [SmFormFieldSizeClasses[12]]: true,
    [MdFormFieldSizeClasses[size]]: !!size,
  }
}

const getFieldClasses = (attrs: any) => {
  return [getSizeClass(attrs?.size), attrs?.class || '']
}

const canShow = (item: any): boolean => {
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

const editedItem = vModel(props, 'modelValue', emit)
const defaultValue: any = editedItem.value?.getValue()

const elements = computed(() => editedItem.value?.getAttributes ? editedItem.value.getAttributes() : [])

const fields = computed(() => elements.value?.filter(x => x._type === 'input') || []);
(function updateInitialValues() {
  for (const field of fields.value) {
    const value = field.value
    if (value != null) {
      ctx.onValueUpdate(getFieldNamePath(field.name), value, true)
    }
  }
})()

ctx.setPropsToWatch(getPropsToWatch())

function getPropsToWatch() {
  const propsToWatch: FormBuilderPropsToWatch = {}

  const watcherProps = fields.value?.filter((field: any) => !!field.watcher)
  for (const watcherProp of watcherProps) {
    const { setter, disableWatcherAfterUserEdit, userChangesOnly } = watcherProp.watcher
    const parameterProps = getAccessedProps(setter.toString())
    const itemProps = Object.values(parameterProps)?.[0]

    for (const prop of itemProps) {
      if (!propsToWatch[prop]) {
        propsToWatch[prop] = []
      }

      propsToWatch[prop].push({ watcherProp: getFieldNamePath(watcherProp.name), setter, disableWatcherAfterUserEdit, userChangesOnly })
    }
  }

  return propsToWatch
}

function getFieldNamePath(name: string) {
  return props.group ? props.group + '.' + name : name
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
