<script setup lang="ts">
import type { ButtonType } from '@/components/button/ButtonConfig'
import type { ButtonGroupType } from '../components/button/components/button-group/ButtonGroupConfig'
import { Info, SquarePen, Trash2 } from 'lucide'
import Button from '../components/button/Button.vue'
import ButtonGroup from '../components/button/components/button-group/ButtonGroup.vue'
import ChevronBtn from '../components/button/components/chevron-btn/ChevronBtn.vue'
import Group from '../shared/components/group/Group.vue'
</script>

<template>
  <div v-for="type in ['fill', 'outline', 'outline-fill', 'text', 'text-fill']" :key="type">
    <span style="margin: 0 15px;">{{ type }}:</span>
    <Button :type="type as ButtonType" color="primary" text="1" />
    <Button :type="type as ButtonType" color="secondary" text="2" />
    <Button :type="type as ButtonType" color="success" text="3" />
    <Button :type="type as ButtonType" color="info" text="4" />
    <Button :type="type as ButtonType" color="warning" text="5" />
    <Button :type="type as ButtonType" color="danger" text="6" />
    <Button :type="type as ButtonType" color="gray" text="7" />
  </div>

  <div>
    <span style="margin: 0 15px;">Actions:</span>
    <Group>
      <Button type="icon" :icon="Info" color="gray" />
      <Button type="icon" :icon="SquarePen" color="info" />
      <Button type="icon" :icon="Trash2" color="danger" />
    </Group>
  </div>

  <div>
    <span style="margin: 0 15px;">Chevron:</span>
    <ChevronBtn />
  </div>

  <div v-for="type in ['fill', 'outline', 'outline-fill', 'text', 'text-fill', 'boxed']" :key="type">
    <span style="margin: 0 15px;">Group {{ type }}:</span>
    <ButtonGroup :type="type as ButtonGroupType">
      <Button color="primary" text="1" />
      <Button color="secondary" text="2" />
      <Button color="success" text="3" />
      <Button color="info" text="4" />
      <Button color="warning" text="5" />
      <Button color="danger" text="6" />
      <Button color="gray" text="7" />
    </ButtonGroup>
  </div>
</template>
