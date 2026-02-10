<script setup lang="ts">
import { ref } from 'vue'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3, Info } from 'lucide-vue-next'

// Local state just for UI display
const currentlyEditing = ref<{ row: number; col: number; sheet: string } | null>(null)
const editValue = ref('')
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
      
      <div v-if="currentlyEditing" class="space-y-3">
        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div class="text-xs">
            <div class="font-medium text-blue-900">
              Row {{ currentlyEditing.row + 1 }}, Column {{ currentlyEditing.col + 1 }}
            </div>
            <div class="text-blue-700 mt-1">
              Sheet: {{ currentlyEditing.sheet }}
            </div>
          </div>
        </div>

        <!-- Edit Input -->
        <div class="space-y-2">
          <Label for="cell-value" class="text-xs text-gray-600">Edit Value</Label>
          <Input 
            id="cell-value"
            v-model="editValue" 
            placeholder="Enter new value..."
            class="font-mono text-sm"
          />
          <div class="flex gap-2">
            <button class="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
              Save
            </button>
            <button 
              @click="currentlyEditing = null"
              class="px-3 py-1.5 text-xs bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
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

    <!-- Quick Reference -->
    <div class="space-y-3">
      <h4 class="font-medium text-sm flex items-center gap-2">
        <Info class="w-4 h-4" />
        Quick Reference
      </h4>
      
      <div class="space-y-2 text-xs">
        <div class="p-2 bg-gray-50 rounded">
          <div class="font-medium text-gray-900">Text</div>
          <div class="text-gray-500 font-mono text-[10px] mt-0.5">Product Name</div>
        </div>

        <div class="p-2 bg-gray-50 rounded">
          <div class="font-medium text-gray-900">Number</div>
          <div class="text-gray-500 font-mono text-[10px] mt-0.5">123 or 45.67</div>
        </div>

        <div class="p-2 bg-gray-50 rounded">
          <div class="font-medium text-gray-900">Formula</div>
          <div class="text-gray-500 font-mono text-[10px] mt-0.5">=SUM(A1:A10)</div>
        </div>
      </div>
    </div>

  </div>
</template>