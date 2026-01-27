<script setup lang="ts">
import type { SectionConfig } from '@/types'
import SectionItem from '@/components/section/SectionItem.vue'

defineProps<{
  sections: SectionConfig[]
}>()
</script>

<template>
  <div class="space-y-8">
    <SectionItem
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
      :section-index="index"
    />
  </div>
</template>