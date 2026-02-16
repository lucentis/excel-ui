<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Edit3, Info, Save, X } from 'lucide-vue-next'
import { excelStore, updateCell } from '@/stores/excelStore'
import { THEME_COLORS } from '@/lib/theme'
import { cn } from '@/lib/utils'
import type { Cell } from 'exceljs'

const editValue = ref('')

function getCellEditableValue(cell: Cell): string {
  const value = (cell as any).value
  if (value === null || value === undefined) return ''
  if (typeof value === 'object' && 'formula' in value) return `=${value.formula}`
  if (typeof value === 'object' && 'richText' in value) return value.richText.map((t: any) => t.text).join('')
  if (typeof value === 'object' && 'text' in value) return value.text
  return String(value)
}

watch(() => excelStore.currentSheet.currentCell, (currentCell) => {
  if (currentCell) {
    editValue.value = getCellEditableValue(currentCell)
  } else {
    editValue.value = ''
  }
}, { immediate: true })

const currentCellInfo = computed(() => {
  const cell = excelStore.currentSheet.currentCell
  if (!cell) return null
  return {
    row: cell.row + 1,
    col: cell.col + 1,
    sheet: excelStore.currentSheet.name,
  }
})

function handleSave() {
  if (!excelStore.currentSheet.currentCell) return
  updateCell(excelStore.currentSheet.currentCell, editValue.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSave()
  }
}
</script>

<template>
  <div class="flex-1 p-4 space-y-6 overflow-y-auto">
    <!-- Active State Info -->
    <div :class="cn('p-3 rounded-lg border', THEME_COLORS.editionTab.activeState)">
      <div class="flex items-start gap-2">
        <Edit3 :class="cn('w-4 h-4 mt-0.5 flex-shrink-0', THEME_COLORS.editionTab.activeIcon)" />
        <div class="flex-1">
          <div :class="cn('text-sm font-medium', THEME_COLORS.editionTab.activeTitle)">Edition Mode Active</div>
          <div :class="cn('text-xs mt-1', THEME_COLORS.editionTab.activeSubtext)">
            Double-click any cell to edit
          </div>
        </div>
      </div>
    </div>

    <!-- Currently Editing Cell -->
    <div class="space-y-3">
      <h4 :class="cn('font-medium text-sm', THEME_COLORS.ui.subtitle)">Current Cell</h4>
      
      <div v-if="currentCellInfo" class="space-y-3">
        <!-- Cell info -->
        <div :class="cn('p-3 rounded-lg border', THEME_COLORS.editionTab.cellInfo)">
          <div class="text-xs">
            <div :class="cn('font-medium', THEME_COLORS.editionTab.cellInfoText)">
              Row {{ Number(currentCellInfo.row) -1 }}, Column {{ Number(currentCellInfo.col) -1 }}
            </div>
            <div :class="cn('mt-1', THEME_COLORS.editionTab.cellInfoSubtext)">
              Sheet: {{ currentCellInfo.sheet }}
            </div>
          </div>
        </div>

        <!-- Edit Input -->
        <div class="space-y-2">
          <Label for="cell-value" :class="cn('text-xs', THEME_COLORS.editionTab.label)">Edit Value</Label>
          <Input 
            id="cell-value"
            v-model="editValue"
            placeholder="Enter new value..."
            class="font-mono text-sm"
            @keydown="handleKeydown"
          />
          
          <!-- Save/Cancel buttons -->
          <div class="flex gap-2">
            <Button 
              @click="handleSave"
              size="sm"
              :class="cn('flex-1', THEME_COLORS.editionTab.button)"
            >
              <Save class="w-3 h-3 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div v-else class="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div :class="cn('text-xs text-center', THEME_COLORS.ui.muted)">
          No cell selected - double-click a cell to edit
        </div>
      </div>
    </div>

    <Separator />

    <!-- Keyboard Shortcuts -->
    <div class="space-y-2">
      <h4 :class="cn('font-medium text-sm', THEME_COLORS.ui.subtitle)">Keyboard Shortcuts</h4>
      
      <div class="space-y-1.5 text-xs">
        <div class="flex items-center justify-between">
          <span :class="THEME_COLORS.ui.body">Save changes</span>
          <kbd class="px-2 py-0.5 bg-gray-100 rounded text-xs border">Enter</kbd>
        </div>
      </div>
    </div>
  </div>
</template>