<script setup lang="ts">
import { ref } from 'vue'
import { excelStore } from '@/stores/excelStore'
import { Settings2, ChevronRight, Layers, CheckCircle2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import CardCustomDialog from './CardCustomDialog.vue'
import SectionCustomDialog from './SectionCustomDialog.vue'
import { THEME_COLORS } from '@/lib/theme'
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
      <h4 :class="cn('font-medium text-sm flex items-center gap-2', THEME_COLORS.customTab.sectionTitle)">
        <ChevronRight :class="cn('w-4 h-4', THEME_COLORS.customTab.icon)" />
        Document
      </h4>

      <!-- Preview du titre -->
      <div :class="cn('p-2 rounded text-sm font-medium', THEME_COLORS.customTab.documentPreview)">
        {{ excelStore.currentSheet.title }}
      </div>
    </div>

    <Separator />

    <!-- Section Cards Recap -->
    <div class="space-y-3">
      <h4 :class="cn('font-medium text-sm flex items-center gap-2', THEME_COLORS.customTab.sectionTitle)">
        <Settings2 :class="cn('w-4 h-4', THEME_COLORS.customTab.icon)" />
        Cards Recap
      </h4>

      <!-- Liste des cards configurées -->
      <div
        v-if="excelStore.currentSheet.sections.some((s) => s.cardRecap)"
        class="space-y-2 mt-3"
      >
        <div
          v-for="(section, index) in excelStore.currentSheet.sections.filter((s) => s.cardRecap)"
          :key="index"
          @click="openCardDialog(index)"
          :class="cn('p-3 rounded-lg border cursor-pointer transition-colors', THEME_COLORS.customTab.iconHover)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div :class="cn('font-medium text-sm', THEME_COLORS.customTab.sectionTitle)">
                {{ section.title || `Section ${index + 1}` }}
              </div>
              <div :class="cn('text-xs mt-1', THEME_COLORS.customTab.sectionSubtext)">
                ⭐ Card value: {{ formatValue(section.cardRecap?.value) }}
              </div>
            </div>
            <Settings2 :class="cn('w-4 h-4', THEME_COLORS.customTab.icon)" />
          </div>
        </div>
      </div>

      <!-- Message si aucune card -->
      <div v-else :class="cn('p-3 border rounded-lg text-sm', THEME_COLORS.customTab.warning)">
        📌 No recap cards configured - Click on a cell to create one
      </div>
    </div>

    <Separator />

    <!-- Section Sections -->
    <div class="space-y-3">
      <h4 :class="cn('font-medium text-sm flex items-center gap-2', THEME_COLORS.customTab.sectionTitle)">
        <Layers :class="cn('w-4 h-4', THEME_COLORS.customTab.icon)" />
        Sections
      </h4>

      <!-- Liste des sections -->
      <div v-if="excelStore.currentSheet.sections.length > 0" class="space-y-2">
        <div
          v-for="(section, index) in excelStore.currentSheet.sections"
          :key="index"
          @click="openSectionDialog(index)"
          :class="cn('p-3 rounded-lg border cursor-pointer transition-colors', THEME_COLORS.customTab.iconHover)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div :class="cn('font-medium text-sm', THEME_COLORS.customTab.sectionTitle)">
                {{ section.title || `Section ${index + 1}` }}
              </div>
              <div :class="cn('text-xs mt-1', THEME_COLORS.customTab.sectionSubtext)">
                {{ section.data.length }} row(s) • {{ section.header.length }} column(s)
              </div>
            </div>
            <Settings2 :class="cn('w-4 h-4', THEME_COLORS.customTab.icon)" />
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

      <!-- Message si aucune section -->
      <div v-else :class="cn('p-3 border rounded-lg text-sm', THEME_COLORS.customTab.warning)">
        ⚠️ No sections detected
      </div>
    </div>

    <Separator />

    <!-- Stats -->
    <div :class="cn('space-y-2 text-xs', THEME_COLORS.customTab.sectionSubtext)">
      <div class="flex justify-between">
        <span>Total rows:</span>
        <span class="font-medium">{{ excelStore.currentSheet.rawData.length }}</span>
      </div>
      <div class="flex justify-between">
        <span>Columns:</span>
        <span class="font-medium">{{ excelStore.currentSheet.rawData[0]?.length || 0 }}</span>
      </div>
    </div>
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