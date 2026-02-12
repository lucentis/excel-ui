<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3, Info } from 'lucide-vue-next'
import { excelStore, updateCell } from '@/stores/excelStore'
import { formatCellValue } from '@/lib/utils'
import { computed, ref } from 'vue'

const cellValue = computed(() => formatCellValue(excelStore.currentSheet.currentCell))

const cellModel = ref()

function handleSave(): void {
  const newValue = cellModel.value ?? cellValue.value;
  updateCell(excelStore.currentSheet.currentCell!, newValue)
}
</script>

<template>
  <div class="flex-1 p-4 space-y-6 overflow-y-auto">
    <!-- Active State Info -->
    <div class="p-3 bg-green-50 rounded-lg border border-green-200">
      <div class="flex items-start gap-2">
        <Edit3 class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
        <div class="flex-1">
          <div class="text-sm font-medium text-green-900">Edition Mode Active</div>
          <div class="text-xs text-green-700 mt-1">
            Double-click any cell to edit
          </div>
        </div>
      </div>
    </div>

    <!-- Currently Editing Cell -->
    <div class="space-y-3">
      <h4 class="font-medium text-sm">Current Cell</h4>
      
      <div v-if="excelStore.currentSheet.currentCell" class="space-y-3">
        <!-- Edit Input -->
        <div class="space-y-2">
          <Label for="cell-value" class="text-xs text-gray-600">Edit Value</Label>
          <div class="flex gap-2">
            <Input 
              id="cell-value"
              placeholder="Enter new value..."
              class="font-mono text-sm"
              :model-value="String(cellValue)"
              @update:model-value="(value) => cellModel = value"
            />

            <button 
              class="px-3 py-1.5 text-sm font-medium bg-green-100 text-green-900 border border-green-200 rounded hover:bg-green-200"
              @click="handleSave"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div v-else class="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="text-xs text-gray-500 text-center">
          No cell selected - double-click a cell to edit
        </div>
      </div>
    </div>

    <Separator />

  </div>
</template>