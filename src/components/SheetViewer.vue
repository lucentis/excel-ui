<script setup lang="ts">
import { computed } from 'vue'
import { excelStore, setCurrentSheet, docTitle, headers, dataRows } from '@/stores/excelStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, FileText } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const hasData = computed(() => excelStore.rawData.length > 0)

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (value instanceof Date) return value.toLocaleDateString('fr-FR')
  return String(value)
}

// Numéro de ligne réel (en tenant compte de l'offset)
function getRealRowNumber(dataRowIndex: number): number {
  return 2 + dataRowIndex
}

function handleSheetChange(sheetName: string) {
  setCurrentSheet(sheetName)
}
</script>

<template>
  <div class="w-full space-y-6">
    <!-- En-tête document -->
    <div class="flex items-center justify-between pb-4 border-b">
      <div class="flex items-center gap-3">
        <FileText class="w-6 h-6 text-blue-600" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ docTitle }}</h2>
          <div class="flex items-center gap-2 mt-1">
            <Badge variant="secondary" class="text-xs">
              {{ excelStore.currentSheetName }}
            </Badge>
            <span class="text-sm text-gray-500">
              {{ excelStore.config.sections.length }} section(s)
            </span>
          </div>
        </div>
      </div>

      <!-- Sélecteur de feuille -->
      <Select
        v-if="excelStore.sheetNames.length > 1"
        :model-value="excelStore.currentSheetName"
        @update:model-value="handleSheetChange"
      >
        <SelectTrigger class="w-[200px]">
          <SelectValue placeholder="Choisir une feuille" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="sheetName in excelStore.sheetNames"
            :key="sheetName"
            :value="sheetName"
          >
            <div class="flex items-center gap-2">
              <Sheet class="w-4 h-4" />
              {{ sheetName }}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Message si pas de données -->
    <div v-if="!hasData" class="text-center py-12 text-gray-500">Aucune donnée à afficher</div>

    <!-- Affichage des sections -->
    <div v-else class="space-y-8">
      <!-- Section par section -->
      <div
        v-for="(section, sectionIndex) in excelStore.config.sections"
        :key="sectionIndex"
        class="space-y-3"
      >
        <!-- Titre de la section -->
        <div v-if="section.title" class="flex items-center gap-2">
          <div class="h-1 w-8 bg-blue-600 rounded"></div>
          <h3 class="text-xl font-semibold text-gray-900">
            {{ section.title }}
          </h3>
        </div>

        <!-- Tableau de la section -->
        <div class="border rounded-lg overflow-hidden">
          <div class="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
                  <TableHead
                    v-for="(header, index) in excelStore.rawData[section.headerRow]"
                    :key="index"
                    class="min-w-[150px]"
                  >
                    {{ formatCellValue(header) || `Col ${index + 1}` }}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="rowIndex in Array.from(
                    { length: section.dataEndRow - section.dataStartRow + 1 },
                    (_, i) => section.dataStartRow + i,
                  )"
                  :key="rowIndex"
                >
                  <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
                    {{ rowIndex + 1 }}
                  </TableCell>
                  <TableCell
                    v-for="(cell, cellIndex) in excelStore.rawData[rowIndex]"
                    :key="cellIndex"
                  >
                    {{ formatCellValue(cell) }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <!-- Message si aucune section mais données existent -->
      <!-- <!-- <div
        v-if="excelStore.config.sections.length === 0"
        class="no-section p-6 border border-dashed rounded-lg text-center text-gray-500"
      >
        <div class="border rounded-lg overflow-hidden">
          <div class="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
                  <TableHead
                    v-for="(header, index) in headers"
                    :key="index"
                    class="min-w-[150px] relative"
                  >
                    <div class="flex items-center gap-2">
                      <span>{{ formatCellValue(header) || `Colonne ${index + 1}` }}</span>
                      <Badge v-if="index === 0" variant="secondary" class="text-xs">
                        📌 EN-TÊTE
                      </Badge>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(row, rowIndex) in dataRows" :key="rowIndex">
                  <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
                    {{ getRealRowNumber(rowIndex) }}
                  </TableCell>
                  <TableCell v-for="(cell, cellIndex) in row" :key="cellIndex">
                    {{ formatCellValue(cell) }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
