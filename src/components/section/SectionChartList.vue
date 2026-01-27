<script setup lang="ts">
import type { SectionConfig } from '@/types'
import SectionChart from '@/components/SectionChart.vue'

defineProps<{
  section: SectionConfig
  sectionIndex: number
}>()
</script>

<template>
  <div 
    v-if="section.charts && section.charts.length > 0" 
    class="flex flex-col gap-4"
  >
    <SectionChart
      v-for="chart in section.charts.filter(c => c.visible)"
      :key="`chart-${sectionIndex}-${chart.columnIndex}`"
      :section="section"
      :section-index="sectionIndex"
      :chart="chart"
    />
  </div>
</template>