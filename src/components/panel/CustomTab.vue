<script setup lang="ts">
import { ref } from 'vue'
import { excelStore } from '@/stores/excelStore'
import { Settings2, ChevronRight, Layers, CheckCircle2 } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import CardCustomDialog from './CardCustomDialog.vue'
import SectionCustomDialog from './SectionCustomDialog.vue'

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
      <h4 class="font-medium text-sm flex items-center gap-2">
        <ChevronRight class="w-4 h-4" />
        Document
      </h4>

      <!-- Preview du titre -->
      <div class="p-2 bg-blue-50 rounded text-sm font-medium text-blue-900">
        {{ excelStore.currentSheet.title }}
      </div>
    </div>

    <Separator />

    <!-- Section Cards Recap -->
    <div class="space-y-3">
      <h4 class="font-medium text-sm flex items-center gap-2">
        <Settings2 class="w-4 h-4" />
        Cards Recap
      </h4>

      <!-- Liste des cards configurées -->
      <div
        v-if="excelStore.currentSheet.sections.some((s) => s.cardRecap)"
        class="space-y-2 mt-3"
      >
        <div
          v-for="(section, index) in excelStore.currentSheet.sections.filter(s => s.cardRecap)"
          :key="index"
          class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          @click="openCardDialog(index)"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="text-xs font-medium text-gray-700 mb-1">
                {{ section.title || `Section ${index + 1}` }}
              </div>
              <div v-if="section.cardRecap" class="text-xs text-gray-600">
                <div>
                  <strong>{{ section.cardRecap.label || 'Valeur' }} :</strong>
                  {{ formatValue(section.cardRecap.value) }}
                </div>
              </div>
            </div>
            <Settings2 class="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div v-else class="text-xs text-gray-500 italic p-2 bg-gray-50 rounded">
        No recap cards configured
      </div>
    </div>

    <Separator />

    <!-- Section Sections -->
    <div class="space-y-3">
      <h4 class="font-medium text-sm flex items-center gap-2">
        <Layers class="w-4 h-4" />
        Sections
      </h4>

      <!-- Liste des sections -->
      <div v-if="excelStore.currentSheet.sections.length > 0" class="space-y-3 mt-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 class="w-4 h-4 text-green-600" />
          <span>{{ excelStore.currentSheet.sections.length }} section(s) detected</span>
        </div>

        <div
          v-for="(section, index) in excelStore.currentSheet.sections"
          :key="index"
          class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          @click="openSectionDialog(index)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="font-medium text-sm">
                {{ section.title || `Section ${index + 1}` }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ section.data.length }} row(s) • {{ section.header.length }} column(s)
              </div>
            </div>
            <Settings2 class="w-4 h-4 text-gray-400" />
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
      <div
        v-else
        class="p-3 border border-orange-200 rounded-lg bg-orange-50 text-sm text-orange-800"
      >
        ⚠️ No sections detected
      </div>
    </div>

    <Separator />

    <!-- Stats -->
    <div class="space-y-2 text-xs text-gray-600">
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