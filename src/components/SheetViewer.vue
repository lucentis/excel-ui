<script setup lang="ts">
import { computed } from 'vue'
import { excelStore, setCurrentSheet } from '@/stores/excelStore'
import SheetHeader from '@/components/sheet/SheetHeader.vue'
import SheetSectionList from '@/components/sheet/SheetSectionList.vue'
import RecapCards from '@/components/RecapCards.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const hasData = computed(() => excelStore.currentSheet.rawData.length > 0)
const hasSections = computed(() => excelStore.currentSheet.sections.length > 0)

function handleSheetChange(sheetName: string) {
  setCurrentSheet(sheetName)
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value instanceof Date) return value.toLocaleDateString('fr-FR')
  return String(value)
}
</script>

<template>
  <div class="w-full space-y-6">
    <!-- Sheet Header -->
    <SheetHeader
      :title="excelStore.currentSheet.title"
      :current-sheet-name="excelStore.currentSheet.name"
      :sheet-names="excelStore.sheetNames"
      :section-count="excelStore.currentSheet.sections.length"
      @sheet-change="handleSheetChange"
    />

    <!-- No data message -->
    <div v-if="!hasData" class="text-center py-12 text-gray-500">
      No data to display
    </div>

    <!-- Display with sections -->
    <template v-else-if="hasSections">
      <!-- Recap cards -->
      <RecapCards />

      <!-- Sections list -->
      <SheetSectionList :sections="excelStore.currentSheet.sections" />
    </template>

    <!-- Fallback: raw display if no sections -->
    <div v-else class="border rounded-lg overflow-hidden">
      <div class="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
              <TableHead
                v-for="(header, index) in excelStore.currentSheet.rawData[0]"
                :key="index"
                class="min-w-[150px]"
              >
                {{ formatCellValue(header) || `Column ${index + 1}` }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(row, rowIndex) in excelStore.currentSheet.rawData.slice(1)"
              :key="rowIndex"
            >
              <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
                {{ rowIndex + 2 }}
              </TableCell>
              <TableCell v-for="(cell, cellIndex) in row" :key="cellIndex">
                {{ formatCellValue(cell) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>