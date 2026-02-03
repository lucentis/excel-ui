<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import type { RowData } from '@/types'

const props = defineProps<{
  row: RowData
  rowIndex: number
  selectedCell?: { row: number; col: number } | null
  isExcluded: boolean
  hasVisibleCharts: boolean
}>()

const emit = defineEmits<{
  cellClick: [colIndex: number]
  toggleExclusion: []
}>()

function isCellSelected(colIndex: number, selectedCell?: { row: number; col: number } | null): boolean {
  if (!selectedCell) return false
  return selectedCell.row === props.rowIndex && selectedCell.col === colIndex
}
</script>

<template>
  <TableRow class="group">
    <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
      <div class="flex items-center gap-2">
        {{ rowIndex + 1 }}
        
        <!-- Eye icon for chart exclusion -->
        <button
          v-if="hasVisibleCharts"
          @click="emit('toggleExclusion')"
          :class="[
            'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100',
            isExcluded ? 'opacity-100' : ''
          ]"
          :title="isExcluded ? 'Include in charts' : 'Exclude from charts'"
        >
          <EyeOff 
            v-if="isExcluded"
            class="w-4 h-4 text-orange-500"
          />
          <Eye 
            v-else
            class="w-4 h-4 text-gray-400"
          />
        </button>
      </div>
    </TableCell>
    
    <TableCell
      v-for="(cell, cellIndex) in row"
      :key="cellIndex"
      :class="[
        'cursor-pointer hover:bg-blue-50',
        isCellSelected(cellIndex, selectedCell) ? 'bg-blue-100' : '',
        isExcluded ? 'opacity-50' : '',
      ]"
      @click="emit('cellClick', cellIndex)"
    >
      <div class="flex items-center gap-2">
        {{ cell }}
        <Badge
          v-if="isCellSelected(cellIndex, selectedCell)"
          class="text-xs bg-sky-100"
        >
          ⭐
        </Badge>
      </div>
    </TableCell>
  </TableRow>
</template>