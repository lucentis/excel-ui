<script setup lang="ts">
import { computed } from 'vue'
import type { SectionConfig } from '@/types'
import { FilterService } from '@/services'
import {
  setCardRecap,
  toggleSectionChart,
  toggleRowExclusion,
  toggleColumnSort,
} from '@/stores/excelStore'
import SectionHeader from './SectionHeader.vue'
import SectionTable from './SectionTable.vue'
import SectionChartList from './SectionChartList.vue'

const props = defineProps<{
  section: SectionConfig
  sectionIndex: number
}>()

const filteredData = computed(() => {
  return FilterService.applyFiltersAndSort(props.section)
})

function handleCellClick(rowIndex: number, colIndex: number) {
  setCardRecap(props.sectionIndex, rowIndex, colIndex)
}

function handleHeaderClick(colIndex: number) {
  if (props.section.data.length > 0) return
  setCardRecap(props.sectionIndex, 0, colIndex)
}

function handleChartIconClick(colIndex: number) {
  toggleSectionChart(props.sectionIndex, colIndex)
}

function handleToggleRowExclusion(rowIndex: number) {
  toggleRowExclusion(props.sectionIndex, rowIndex)
}

function handleSortClick(colIndex: number) {
  toggleColumnSort(props.sectionIndex, colIndex)
}
</script>

<template>
  <div class="space-y-3">
    <SectionHeader
      :section="section"
      :section-index="sectionIndex"
      :filtered-count="filteredData.length"
      :total-count="section.data.length"
    />

    <div class="flex gap-4 items-start">
      <SectionTable
        :section="section"
        :section-index="sectionIndex"
        :filtered-data="filteredData"
        @cell-click="handleCellClick"
        @header-click="handleHeaderClick"
        @chart-icon-click="handleChartIconClick"
        @toggle-row-exclusion="handleToggleRowExclusion"
        @sort-click="handleSortClick"
      />

      <SectionChartList
        :section="section"
        :section-index="sectionIndex"
      />
    </div>
  </div>
</template>