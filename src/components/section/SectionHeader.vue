<script setup lang="ts">
import { computed } from 'vue'
import type { SectionConfig } from '@/types'
import { Section } from '@/models'
import { setApplyFiltersToCharts } from '@/stores/excelStore'
import SearchBar from '@/components/SearchBar.vue'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  section: SectionConfig
  sectionIndex: number
  filteredCount: number
  totalCount: number
}>()

const sectionModel = computed(() => Section.fromConfig(props.section))

const hasVisibleCharts = computed(() => {
  return sectionModel.value.getVisibleCharts().length > 0
})

const hasActiveFilters = computed(() => {
  return !!props.section.searchText || !!props.section.sortConfig
})

const showFilterToggle = computed(() => {
  return hasVisibleCharts.value && hasActiveFilters.value
})

const applyFiltersToCharts = computed({
  get: () => props.section.applyFiltersToCharts ?? true,
  set: (value: boolean) => setApplyFiltersToCharts(props.sectionIndex, value)
})
</script>

<template>
  <div class="flex items-center justify-between gap-4 mb-3">
    <!-- Section title -->
    <div v-if="section.title" class="flex items-center gap-2">
      <div class="h-1 w-8 bg-blue-600 rounded"></div>
      <h3 class="text-xl font-semibold text-gray-900">
        {{ section.title }}
      </h3>
    </div>

    <!-- Right side: Search bar + filter toggle -->
    <div class="flex items-center gap-3">
      <!-- Search bar -->
      <SearchBar
        :section="section"
        :section-index="sectionIndex"
        :filtered-count="filteredCount"
        :total-count="totalCount"
      />

      <!-- Filter toggle (only if charts + filters active) -->
      <div v-if="showFilterToggle" class="flex items-center gap-2 pl-3 border-l">
        <Switch 
          :id="`filter-toggle-${sectionIndex}`"
          v-model="applyFiltersToCharts"
          size="sm"
        />
        <Label 
          :for="`filter-toggle-${sectionIndex}`"
          class="text-sm text-gray-600 cursor-pointer"
        >
          Link charts
        </Label>
      </div>
    </div>
  </div>
</template>