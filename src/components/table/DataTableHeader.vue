<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { TableHead, TableRow } from '@/components/ui/table'
import type { RowData } from '@/types'

defineProps<{
  headers: RowData
  numericColumns: number[]
  selectedCell?: { row: number; col: number } | null
  hasDataRows: boolean
}>()

const emit = defineEmits<{
  headerClick: [colIndex: number]
  chartIconClick: [colIndex: number]
}>()

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

function isCellSelected(colIndex: number): boolean {
  return false
}
</script>

<template>
  <TableRow>
    <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
    <TableHead
      v-for="(header, index) in headers"
      :key="index"
      class="min-w-[150px] cursor-pointer"
      :class="[
        selectedCell?.row === 0 && selectedCell?.col === index && !hasDataRows
          ? 'bg-blue-100'
          : '',
      ]"
      @click="emit('headerClick', index)"
    >
      <div class="flex items-center gap-4 group">
        {{ formatCellValue(header) || `Col ${index + 1}` }}

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