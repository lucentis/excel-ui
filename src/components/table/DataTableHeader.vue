<script setup lang="ts">
import { ArrowUp, ArrowDown, BarChart3 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { TableHead, TableRow } from '@/components/ui/table'
import type { RowData, SortConfig } from '@/types'
import type { SectionColorThemeDefinition } from '@/lib/sectionTheme'
import type { Cell } from 'exceljs'
import { excelStore } from '@/stores/excelStore'

const props = defineProps<{
  headers: RowData
  numericColumns: number[]
  selectedCell?: { row: number; col: number } | null
  hasDataRows: boolean
  sortConfig?: SortConfig
  colorTheme?: SectionColorThemeDefinition
}>()

const emit = defineEmits<{
  headerClick: [colIndex: number]
  chartIconClick: [colIndex: number]
  sortClick: [colIndex: number]
}>()

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function getSortIcon(colIndex: number, sortConfig?: SortConfig) {
  if (!sortConfig || sortConfig.columnIndex !== colIndex) return null
  return sortConfig.direction === 'asc' ? ArrowUp : ArrowDown
}

function handleDoubleClick(header: Cell): void {
  if (!excelStore.currentSheet.editionMode) return 
  
  const cell: Cell = excelStore.currentSheet.rawData[Number(header.row) -1]?.[Number(header.col) - 1]!

  excelStore.currentSheet.currentCell = cell
  excelStore.currentSheet.editionMode = true

}
</script>

<template>
  <TableRow>
    <TableHead class="w-12 sticky left-0 z-10 border-r" :class="[colorTheme?.text, colorTheme?.border]">#</TableHead>
    <TableHead
      v-for="(header, index) in headers"
      :key="index"
      :class="[
        'min-w-[150px] cursor-pointer hover:bg-gray-100',
        selectedCell?.row === 0 && selectedCell?.col === index && !hasDataRows
          ? 'bg-blue-100'
          : '',
        colorTheme?.text,
      ]"
      @dblclick="handleDoubleClick(header)"
      @click="emit('headerClick', index)"
    >
      <div class="flex items-center gap-4 group">
        <div 
          class="flex items-center gap-1 flex-1"
          @click="props.hasDataRows ? emit('sortClick', index) : null"
        >
          {{ formatCellValue(header) || `Col ${index + 1}` }}
          
          <component 
            :is="getSortIcon(index, sortConfig)"
            v-if="getSortIcon(index, sortConfig)"
            class="w-4 h-4 text-blue-600"
          />
        </div>

        <Badge
          v-if="selectedCell?.row === 0 && selectedCell?.col === index && !hasDataRows"
          class="text-xs bg-sky-100"
        >
          ⭐
        </Badge>

        <!-- Chart icon on hover for numeric columns -->
        <button
          v-if="numericColumns.includes(index)"
          @click.stop="emit('chartIconClick', index)"
          class="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 cursor-pointer"
        >
          <BarChart3 class="w-4 h-4" />
        </button>
      </div>
    </TableHead>
  </TableRow>
</template>