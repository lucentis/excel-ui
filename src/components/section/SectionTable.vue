<script setup lang="ts">
import { computed } from 'vue'
import type { SectionConfig, DataMatrix, RowData } from '@/types'
import { Section } from '@/models'
import { ChartService } from '@/services'
import { getSectionColorTheme, getTableBorderClass } from '@/lib/sectionTheme'
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
  toggleRowExclusion: [row: RowData]
  sortClick: [colIndex: number]
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

const colorTheme = computed(() => getSectionColorTheme(sectionModel.value.style.colorTheme))

const tableClasses = computed(() => {
  const style = sectionModel.value.style.tableStyle
  return getTableBorderClass(style.showBorders, style.roundedBorders)
})

function isRowExcluded(row: RowData): boolean {
  const visibleCharts = sectionModel.value.getVisibleCharts()
  return visibleCharts.some(chart => chart.isRowExcluded(row))
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
  <div :class="['overflow-hidden grow', tableClasses]">
    <div class="overflow-auto max-h-[400px]">
      <Table>
        <TableHeader :class="[colorTheme.bg]">
          <DataTableHeader
            :headers="section.header"
            :numeric-columns="numericColumns"
            :selected-cell="getSelectedCell()"
            :has-data-rows="section.data.length > 0"
            :sort-config="section.sortConfig"
            :color-theme="colorTheme"
            @header-click="(colIndex) => emit('headerClick', colIndex)"
            @chart-icon-click="(colIndex) => emit('chartIconClick', colIndex)"
            @sort-click="(colIndex) => emit('sortClick', colIndex)"
          />
        </TableHeader>
        <TableBody>
          <DataTableRow
            v-for="(row, rowIndex) in filteredData"
            :key="rowIndex"
            :row="row"
            :row-index="rowIndex"
            :selected-cell="getSelectedCell()"
            :is-excluded="isRowExcluded(row)"
            :has-visible-charts="hasVisibleCharts"
            :alternating-rows="sectionModel.style.tableStyle.alternatingRows"
            @cell-click="(colIndex) => emit('cellClick', rowIndex, colIndex)"
            @toggle-exclusion="emit('toggleRowExclusion', row)"
          />
        </TableBody>
      </Table>
    </div>
  </div>
</template>