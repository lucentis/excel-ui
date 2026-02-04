<script setup lang="ts">
import SelectionMode from './SelectionMode.vue'
// import { Switch } from '@/components/ui/switch'

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === '') return '(vide)'
  return String(value).substring(0, 30)
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  return String(value)
}

// function toggleSelectionMode(enabled: boolean) {
//   setSelectionMode(enabled)
// }
</script>

<template>
 <SelectionMode></SelectionMode>
</template>
