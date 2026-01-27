<script setup lang="ts">
import { FileText, Sheet } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

defineProps<{
  title: string
  currentSheetName: string
  sheetNames: string[]
  sectionCount: number
}>()

const emit = defineEmits<{
  sheetChange: [sheetName: string]
}>()
</script>

<template>
  <div class="flex items-center justify-between pb-4 border-b">
    <div class="flex items-center gap-3">
      <FileText class="w-6 h-6 text-blue-600" />
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
        <div class="flex items-center gap-2 mt-1">
          <Badge variant="secondary" class="text-xs">
            {{ currentSheetName }}
          </Badge>
          <span class="text-sm text-gray-500">
            {{ sectionCount }} section{{ sectionCount > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Sheet selector -->
    <Select
      v-if="sheetNames.length > 1"
      :model-value="currentSheetName"
      @update:model-value="(value) => emit('sheetChange', value as string)"
    >
      <SelectTrigger class="w-[200px]">
        <SelectValue placeholder="Choose a sheet" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="name in sheetNames"
          :key="name"
          :value="name"
        >
          <div class="flex items-center gap-2">
            <Sheet class="w-4 h-4" />
            {{ name }}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>