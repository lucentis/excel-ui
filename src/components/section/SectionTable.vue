<script setup lang="ts">
import { computed } from 'vue'
import type { SectionConfig, DataMatrix } from '@/types'
import { Section } from '@/models'
import { ChartService } from '@/services'
import {
  Table,
  TableBody,
  TableHeader,
} from '@/components/ui/table'
import DataTableHeader from '@/components/table/DataTableHeader.vue'
import DataTableRow from '@/components/table/DataTableRow.vue'

const props = defineProps<{
  section: SectionConfig
  sectionIndex: number
  filteredData: DataMatrix
}>()

const emit = defineEmits<{
  cellClick: [rowIndex: number, colIndex: number]
  headerClick: [colIndex: number]
  chartIconClick: [colIndex: number]
  toggleRowExclusion: [rowIndex: number]
}>()

const sectionModel = computed(() => Section.fromConfig(props.section))

const numericColumns = computed(() => {
  return props.section.header
    .map((_, index) => index)
    .filter(index => ChartService.isNumericColumn(props.section, index))
})

const hasVisibleCharts = computed(() => {
  return sectionModel.value.getVisibleCharts().length > 0
})

function isRowExcluded(rowIndex: number): boolean {
  const visibleCharts = sectionModel.value.getVisibleCharts()
  return visibleCharts.some(chart => chart.isRowExcluded(rowIndex))
}

function getSelectedCell(): { row: number; col: number } | null {
  if (!props.section.cardRecap) return null
  return {
    row: props.section.cardRecap.rowIndex,
    col: props.section.cardRecap.colIndex,
  }
}
</script>

<template>
  <div class="border rounded-lg overflow-hidden grow">
    <div class="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader>
          <DataTableHeader
            :headers="section.header"
            :numeric-columns="numericColumns"
            :selected-cell="getSelectedCell()"
            :has-data-rows="section.data.length > 0"
            @header-click="(colIndex) => emit('headerClick', colIndex)"
            @chart-icon-click="(colIndex) => emit('chartIconClick', colIndex)"
          />
        </TableHeader>
        <TableBody>
          <DataTableRow
            v-for="(row, rowIndex) in filteredData"
            :key="rowIndex"
            :row="row"
            :row-index="rowIndex"
            :selected-cell="getSelectedCell()"
            :is-excluded="isRowExcluded(rowIndex)"
            :has-visible-charts="hasVisibleCharts"
            @cell-click="(colIndex) => emit('cellClick', rowIndex, colIndex)"
            @toggle-exclusion="emit('toggleRowExclusion', rowIndex)"
          />
        </TableBody>
      </Table>
    </div>
  </div>
</template>