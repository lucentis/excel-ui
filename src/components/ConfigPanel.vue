<script setup lang="ts">
import { excelStore, setSelectionMode } from '@/stores/excelStore'
import { Settings2, ChevronRight, Layers, CheckCircle2, MousePointerClick } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === '') return '(vide)'
  return String(value).substring(0, 30)
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  return String(value)
}

function toggleSelectionMode(enabled: boolean) {
  setSelectionMode(enabled)
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
      <p class="text-sm text-gray-500 mt-1">Structure détectée automatiquement</p>
    </div>

    <!-- Content -->
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
          <MousePointerClick class="w-4 h-4" />
          Cards Recap
        </h4>

        <p class="text-xs text-gray-600">
          Sélectionnez une cellule importante par section pour les cartes récap
        </p>

        <!-- Toggle mode sélection -->
        <div
          class="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200"
        >
          <div class="flex-1">
            <div class="text-sm font-medium">Mode sélection</div>
            <div class="text-xs text-gray-600">Cliquez sur une cellule dans le tableau</div>
          </div>
          <Switch
            :model-value="excelStore.selectionMode"
            @update:model-value="toggleSelectionMode"
          />
        </div>

        <!-- Liste des cards configurées -->
        <div
          v-if="excelStore.currentSheet.sections.some((s) => s.cardRecap)"
          class="space-y-2 mt-3"
        >
          <div
            v-for="(section, index) in excelStore.currentSheet.sections"
            :key="index"
            class="p-2 border rounded bg-gray-50"
          >
            <div class="text-xs font-medium text-gray-700 mb-1">
              {{ section.title || `Section ${index + 1}` }}
            </div>
            <div v-if="section.cardRecap" class="text-xs text-gray-600">
              <div>
                <strong>{{ section.cardRecap.label || 'Valeur' }} :</strong>
                {{ formatValue(section.cardRecap.value) }}
              </div>
              <div class="text-gray-500">
                Ligne {{ section.cardRecap.rowIndex + 1 }}, Col {{ section.cardRecap.colIndex + 1 }}
              </div>
            </div>
            <div v-else class="text-xs text-gray-400 italic">Non configurée</div>
          </div>
        </div>

        <div v-else class="text-xs text-gray-500 italic p-2 bg-gray-50 rounded">
          Activez le mode sélection et cliquez sur des cellules
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
            <span>{{ excelStore.currentSheet.sections.length }} section(s) détectée(s)</span>
          </div>

          <div
            v-for="(section, index) in excelStore.currentSheet.sections"
            :key="index"
            class="p-3 border rounded-lg space-y-2 bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="font-medium text-sm">
                  {{ section.title || `Section ${index + 1}` }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ section.data.length }} ligne(s) de données
                </div>
              </div>
              <Badge variant="secondary" class="text-xs">
                {{ section.header.length }} colonnes
              </Badge>
            </div>

            <!-- Preview des en-têtes -->
            <div class="space-y-1">
              <div class="text-xs text-gray-600 font-medium">En-têtes :</div>
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
          ⚠️ Aucune section détectée. Vérifiez que votre fichier respecte les conventions.
        </div>
      </div>

      <Separator />

      <!-- Stats -->
      <div class="space-y-2 text-xs text-gray-600">
        <div class="flex justify-between">
          <span>Total lignes :</span>
          <span class="font-medium">{{ excelStore.currentSheet.rawData.length }}</span>
        </div>
        <div class="flex justify-between">
          <span>Colonnes :</span>
          <span class="font-medium">{{ excelStore.currentSheet.rawData[0]?.length || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
