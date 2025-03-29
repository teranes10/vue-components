<script setup lang="ts">
import ButtonView from './pages/ButtonView.vue'
import FormView from './pages/FormView.vue'
import InputView from './pages/InputView.vue'
import TableView from './pages/TableView.vue'
</script>

<template>
  <div style="padding: 1rem; display: flex; flex-direction: column; gap: 3rem;">
    <ButtonView />

    <TableView />

    <InputView />

    <FormView />
  </div>
</template>
