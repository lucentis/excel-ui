<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import type { RowData } from '@/types'
import { excelStore } from '@/stores/excelStore'
import { DATA_TABLE } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { Cell } from 'exceljs'

const props = defineProps<{
  row: RowData
  rowIndex: number
  selectedCell?: { row: number; col: number } | null
  isExcluded: boolean
  hasVisibleCharts: boolean
  alternatingRows?: boolean
}>()

const emit = defineEmits<{
  cellClick: [colIndex: number]
  toggleExclusion: []
}>()

function isCellSelected(colIndex: number, selectedCell?: { row: number; col: number } | null): boolean {
  if (!selectedCell) return false
  return selectedCell.row === props.rowIndex && selectedCell.col === colIndex
}

function handleDoubleClick(cell: Cell): void {
  if (!excelStore.currentSheet.editionMode) return 
  excelStore.currentSheet.currentCell = cell
  console.log('double click on cell', cell)
}
</script>

<template>
  <TableRow 
    :class="[
      'group',
      alternatingRows && rowIndex % 2 === 1 ? 'bg-gray-50' : '',
    ]"
  >
    <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
      <div class="flex items-center gap-2">
        {{ rowIndex + 1 }}
        
        <!-- Eye icon for chart exclusion -->
        <button
          v-if="hasVisibleCharts"
          @click="emit('toggleExclusion')"
          :class="cn(
            'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded',
            DATA_TABLE.iconBg,
            isExcluded ? 'opacity-100' : ''
          )"
          :title="isExcluded ? 'Include in charts' : 'Exclude from charts'"
        >
          <EyeOff 
            v-if="isExcluded"
            :class="cn('w-4 h-4', DATA_TABLE.excluded)"
          />
          <Eye 
            v-else
            :class="cn('w-4 h-4', DATA_TABLE.icon)"
          />
        </button>
      </div>
    </TableCell>
    
    <TableCell
      v-for="(cell, cellIndex) in row"
      :key="cellIndex"
      :class="cn(
        'cursor-pointer',
        DATA_TABLE.hover,
        isCellSelected(cellIndex, selectedCell) ? DATA_TABLE.selected : '',
        isExcluded ? 'opacity-50' : ''
      )"
      @click="!excelStore.currentSheet.editionMode && emit('cellClick', cellIndex)"
      @dblclick="handleDoubleClick(cell)"
    >
      <div class="flex items-center gap-2 relative">
        {{ cell }}

        <!-- Badge pour l'adresse Excel -->
        <Badge
          v-if="excelStore.currentSheet.currentCell?.formula"
          :class="cn('absolute top-0 right-0 text-[0.6em]', DATA_TABLE.addressBadge)"
        >
          {{ cell.address }}
        </Badge>
        <Badge
          v-if="isCellSelected(cellIndex, selectedCell)"
          :class="cn('text-xs', DATA_TABLE.selectedBadge)"
        >
          ⭐
        </Badge>
      </div>
    </TableCell>
  </TableRow>
</template>