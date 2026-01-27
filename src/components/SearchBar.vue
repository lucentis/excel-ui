<script setup lang="ts">
import { computed } from 'vue'
import type { SectionConfig } from '@/types'
import { setSearchText } from '@/stores/excelStore'
import { Search, X } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  section: SectionConfig
  sectionIndex: number
  filteredCount: number
  totalCount: number
}>()

const searchText = computed({
  get: () => props.section.searchText || '',
  set: (value: string) => setSearchText(props.sectionIndex, value)
})
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Search input -->
    <div class="relative w-64">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        v-model="searchText"
        :placeholder="`Search in ${props.section.title || 'section'}...`"
        class="pl-9 pr-9 h-9"
      />
      <button
        v-if="searchText"
        @click="searchText = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Results counter -->
    <div class="text-sm text-gray-600">
      <strong>{{ filteredCount }}</strong>
      <template v-if="filteredCount !== totalCount">
        / {{ totalCount }}
      </template>
      row{{ filteredCount > 1 ? 's' : '' }}
    </div>
  </div>
</template>