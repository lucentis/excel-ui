<script setup lang="ts">
import type { SectionConfig } from '@/types'
import SearchBar from '@/components/SearchBar.vue'

defineProps<{
  section: SectionConfig
  sectionIndex: number
  filteredCount: number
  totalCount: number
}>()
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

    <!-- Search bar -->
    <SearchBar
      :section="section"
      :section-index="sectionIndex"
      :filtered-count="filteredCount"
      :total-count="totalCount"
    />
  </div>
</template>