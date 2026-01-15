<script setup lang="ts">
import { computed } from 'vue'
import { excelStore, setDocTitleRow, setAutoDetect, docTitle } from '@/stores/excelStore'
import { Settings2, ChevronRight, Layers, CheckCircle2 } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const rowOptions = computed(() => {
  const max = Math.min(excelStore.rawData.length, 10)
  return Array.from({ length: max }, (_, i) => i)
})

function handleDocTitleChange(value: string) {
  setDocTitleRow(parseInt(value))
}

function handleAutoDetectChange(checked: boolean) {
  setAutoDetect(checked)
}

// Formater une cellule pour l'affichage
function formatCell(value: any): string {
  if (value === null || value === undefined || value === '') return '(vide)'
  return String(value).substring(0, 30)
}
</script>

<template>
  <div class="w-80 border-l bg-white flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b">
      <div class="flex items-center gap-2">
        <Settings2 class="w-5 h-5 text-gray-600" />
        <h3 class="font-semibold text-lg">Configuration</h3>
      </div>
      <p class="text-sm text-gray-500 mt-1">Personnalisez la structure de vos données</p>
    </div>

    <!-- Content -->
    <div class="flex-1 p-4 space-y-6 overflow-y-auto">
      <!-- Section Document -->
      <div class="space-y-3">
        <h4 class="font-medium text-sm flex items-center gap-2">
          <ChevronRight class="w-4 h-4" />
          Document
        </h4>

        <!-- Ligne titre -->
        <div class="space-y-2">
          <Label for="doc-title" class="text-sm"> Ligne du titre </Label>
          <Select
            :model-value="excelStore.config.docTitleRow.toString()"
            @update:model-value="handleDocTitleChange"
          >
            <SelectTrigger id="doc-title">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="index in rowOptions" :key="index" :value="index.toString()">
                Ligne {{ index + 1 }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Preview du titre -->
          <div class="p-2 bg-blue-50 rounded text-sm font-medium text-blue-900">
            {{ docTitle }}
          </div>
        </div>
      </div>

      <Separator />

      <!-- Section Auto-détection -->
      <div class="space-y-3">
        <h4 class="font-medium text-sm flex items-center gap-2">
          <Layers class="w-4 h-4" />
          Sections
        </h4>

        <!-- Toggle auto-détection -->
        <div class="flex items-center justify-between">
          <Label for="auto-detect" class="text-sm"> Détection automatique </Label>
          <Switch
            id="auto-detect"
            :checked="excelStore.config.autoDetect"
            @update:checked="handleAutoDetectChange"
          />
        </div>

        <p class="text-xs text-gray-500">Détecte les sections séparées par des lignes vides</p>

        <!-- Liste des sections -->
        <div v-if="excelStore.config.sections.length > 0" class="space-y-3 mt-4">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 class="w-4 h-4 text-green-600" />
            <span>{{ excelStore.config.sections.length }} section(s) détectée(s)</span>
          </div>

          <div
            v-for="(section, index) in excelStore.config.sections"
            :key="index"
            class="p-3 border rounded-lg space-y-2 bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium text-sm">
                  {{ section.title || `Section ${index + 1}` }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Lignes {{ section.startRow + 1 }} - {{ section.dataEndRow + 1 }}
                </div>
              </div>
              <Badge variant="secondary" class="text-xs">
                {{ section.dataEndRow - section.dataStartRow + 1 }} lignes
              </Badge>
            </div>

            <!-- Preview des en-têtes -->
            <div class="space-y-1">
              <div class="text-xs text-gray-600 font-medium">En-têtes :</div>
              <div class="flex flex-wrap gap-1">
                <Badge
                  v-for="(cell, cellIndex) in excelStore.rawData[section.headerRow]?.slice(0, 3)"
                  :key="cellIndex"
                  variant="outline"
                  class="text-xs"
                >
                  {{ formatCell(cell) }}
                </Badge>
                <Badge
                  v-if="excelStore.rawData[section.headerRow]?.length > 3"
                  variant="outline"
                  class="text-xs"
                >
                  +{{ excelStore.rawData[section.headerRow].length - 3 }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucune section -->
        <div
          v-else-if="excelStore.config.autoDetect"
          class="p-3 border border-orange-200 rounded-lg bg-orange-50 text-sm text-orange-800"
        >
          ⚠️ Aucune section détectée. Vérifiez que votre fichier respecte les conventions.
        </div>
      </div>

      <Separator />

      <!-- Stats -->
      <div class="space-y-2 text-xs text-gray-600">
        <div class="flex justify-between">
          <span>Total lignes :</span>
          <span class="font-medium">{{ excelStore.rawData.length }}</span>
        </div>
        <div class="flex justify-between">
          <span>Colonnes :</span>
          <span class="font-medium">{{ excelStore.rawData[0]?.length || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
