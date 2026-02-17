<script setup lang="ts">
import { ref } from 'vue'
import { excelStore } from '@/stores/excelStore'
import { Settings2, ChevronRight, Layers } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import CardCustomDialog from './CardCustomDialog.vue'
import SectionCustomDialog from './SectionCustomDialog.vue'
import { PANEL_CUSTOM, UI, SEMANTIC } from '@/lib/theme'
import { cn } from '@/lib/utils'

const selectedCardIndex = ref<number | null>(null)
const selectedSectionIndex = ref<number | null>(null)

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === '') return '(vide)'
  return String(value).substring(0, 30)
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  return String(value)
}

function openCardDialog(index: number) {
  selectedCardIndex.value = index
}

function closeCardDialog() {
  selectedCardIndex.value = null
}

function openSectionDialog(index: number) {
  selectedSectionIndex.value = index
}

function closeSectionDialog() {
  selectedSectionIndex.value = null
}
</script>

<template>
  <div class="flex-1 p-4 space-y-6 overflow-y-auto">
    <!-- Section Document -->
    <div class="space-y-3">
      <h4 :class="cn('font-medium text-sm flex items-center gap-2', UI.subtitle)">
        <ChevronRight :class="cn('w-4 h-4', UI.muted)" />
        Document
      </h4>

      <!-- Preview du titre -->
      <div :class="cn('p-2 rounded text-sm font-medium', PANEL_CUSTOM.documentPreview)">
        {{ excelStore.currentSheet.title }}
      </div>
    </div>

    <Separator />

    <!-- Section Cards Recap -->
    <div class="space-y-3">
      <h4 :class="cn('font-medium text-sm flex items-center gap-2', UI.subtitle)">
        <Settings2 :class="cn('w-4 h-4', UI.muted)" />
        Cards Recap
      </h4>

      <div
        v-if="excelStore.currentSheet.sections.some((s) => s.cardRecap)"
        class="space-y-2 mt-3"
      >
        <div
          v-for="(section, index) in excelStore.currentSheet.sections.filter((s) => s.cardRecap)"
          :key="index"
          @click="openCardDialog(index)"
          :class="cn('p-3 rounded-lg border cursor-pointer transition-colors', PANEL_CUSTOM.iconHover)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div :class="cn('font-medium text-sm', UI.body)">
                {{ section.title || `Section ${index + 1}` }}
              </div>
              <div :class="cn('text-xs mt-1', UI.muted)">
                Card value: {{ formatValue(section.cardRecap?.value) }}
              </div>
            </div>
            <Settings2 :class="cn('w-4 h-4', UI.muted)" />
          </div>
        </div>
      </div>

      <div v-else :class="cn('p-3 border rounded-lg text-sm', SEMANTIC.warning.bg, SEMANTIC.warning.border, SEMANTIC.warning.text)">
        No recap cards configured — click on a cell to create one
      </div>
    </div>

    <Separator />

    <!-- Section Sections -->
    <div class="space-y-3">
      <h4 :class="cn('font-medium text-sm flex items-center gap-2', UI.subtitle)">
        <Layers :class="cn('w-4 h-4', UI.muted)" />
        Sections
      </h4>

      <div v-if="excelStore.currentSheet.sections.length > 0" class="space-y-2">
        <div
          v-for="(section, index) in excelStore.currentSheet.sections"
          :key="index"
          @click="openSectionDialog(index)"
          :class="cn('p-3 rounded-lg border cursor-pointer transition-colors', PANEL_CUSTOM.iconHover)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div :class="cn('font-medium text-sm', UI.body)">
                {{ section.title || `Section ${index + 1}` }}
              </div>
              <div :class="cn('text-xs mt-1', UI.muted)">
                {{ section.data.length }} row(s) • {{ section.header.length }} column(s)
              </div>
            </div>
            <Settings2 :class="cn('w-4 h-4', UI.muted)" />
          </div>

          <!-- Preview des en-têtes -->
          <div class="space-y-1 mt-2">
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="(cell, cellIndex) in section.header.slice(0, 3)"
                :key="cellIndex"
                variant="outline"
                class="text-xs"
              >
                {{ formatCell(cell) }}
              </Badge>
              <Badge v-if="section.header.length > 3" variant="outline" class="text-xs">
                +{{ section.header.length - 3 }}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div v-else :class="cn('p-3 border rounded-lg text-sm', SEMANTIC.warning.bg, SEMANTIC.warning.border, SEMANTIC.warning.text)">
        No sections detected
      </div>
    </div>

    <Separator />
  </div>

  <!-- Dialogs -->
  <CardCustomDialog
    v-if="selectedCardIndex !== null"
    :section-index="selectedCardIndex"
    @close="closeCardDialog"
  />

  <SectionCustomDialog
    v-if="selectedSectionIndex !== null"
    :section-index="selectedSectionIndex"
    @close="closeSectionDialog"
  />
</template>