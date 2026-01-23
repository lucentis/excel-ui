<script setup lang="ts">
import { computed } from 'vue'
import { excelStore, setCardRecap, setCurrentSheet, toggleSectionChart, toggleRowExclusion } from '@/stores/excelStore'
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
import { Sheet, FileText, BarChart3, EyeOff, Eye } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import RecapCards from './RecapCards.vue'
import { isNumericColumn } from '@/utils/chartManager'
import SectionChart from './SectionChart.vue'

const hasData = computed(() => excelStore.currentSheet.rawData.length > 0)

const hasSections = computed(() => excelStore.currentSheet.sections.length > 0)

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (value instanceof Date) return value.toLocaleDateString('fr-FR')
  return String(value)
}

function handleSheetChange(sheetName: string) {
  setCurrentSheet(sheetName)
}

function handleCellClick(sectionIndex: number, rowIndex: number, colIndex: number) {
  console.log(sectionIndex, rowIndex, colIndex)
  setCardRecap(sectionIndex, rowIndex, colIndex)
}

function handleHeaderClick(sectionIndex: number, colIndex: number) {
  if (excelStore.currentSheet.sections[sectionIndex]?.data.length) {
    return
  }
  setCardRecap(sectionIndex, 0, colIndex)
}

function handleChartIconClick(sectionIndex: number, colIndex: number) {
  toggleSectionChart(sectionIndex, colIndex)
}

function isCellSelected(sectionIndex: number, rowIndex: number, colIndex: number): boolean {
  const section = excelStore.currentSheet.sections[sectionIndex]
  return section?.cardRecap?.rowIndex === rowIndex && section?.cardRecap?.colIndex === colIndex
}

// ✨ Fonctions mises à jour pour gérer plusieurs charts
function handleToggleRowInChart(sectionIndex: number, rowIndex: number) {
  toggleRowExclusion(sectionIndex, rowIndex)
}

function isRowExcludedFromChart(sectionIndex: number, rowIndex: number): boolean {
  const section = excelStore.currentSheet.sections[sectionIndex]
  if (!section?.charts) return false
  
  // Une ligne est exclue si au moins un graphique visible l'a exclue
  return section.charts.some(chart => 
    chart.visible && chart.excludedRows?.includes(rowIndex)
  )
}

function hasVisibleChart(sectionIndex: number): boolean {
  const section = excelStore.currentSheet.sections[sectionIndex]
  return section?.charts?.some(chart => chart.visible) || false
}
</script>

<template>
  <div class="w-full space-y-6">
    <!-- En-tête document -->
    <div class="flex items-center justify-between pb-4 border-b">
      <div class="flex items-center gap-3">
        <FileText class="w-6 h-6 text-blue-600" />
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ excelStore.currentSheet.title }}</h2>
          <div class="flex items-center gap-2 mt-1">
            <Badge variant="secondary" class="text-xs">
              {{ excelStore.currentSheet.name }}
            </Badge>
            <span class="text-sm text-gray-500">
              {{ excelStore.currentSheet.sections.length }} section(s)
            </span>
          </div>
        </div>
      </div>

      <!-- Sélecteur de feuille -->
      <Select
        v-if="excelStore.sheetNames.length > 1"
        :model-value="excelStore.currentSheet.name"
        @update:model-value="(sheetName) => handleSheetChange(sheetName as string)"
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

    <!-- Affichage avec sections -->
    <div v-else-if="hasSections">
      <!-- Cards Recap -->
      <RecapCards />

      <!-- Sections -->
      <div class="space-y-8">
        <!-- Section par section -->
        <div
          v-for="(section, sectionIndex) in excelStore.currentSheet.sections"
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

          <div class="flex gap-4 items-start">
            <!-- Tableau de la section -->
            <div class="border rounded-lg overflow-hidden grow">
              <div class="overflow-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
                      <TableHead
                        v-for="(header, index) in section.header"
                        :key="index"
                        class="min-w-[150px]"
                        :class="[
                          isCellSelected(sectionIndex, 0, index) && !section.data.length
                            ? 'bg-blue-100'
                            : '',
                        ]"
                        @click="handleHeaderClick(sectionIndex, index)"
                      >
                        <div class="flex items-center gap-4 group">
                          {{ formatCellValue(header) || `Col ${index + 1}` }}

                          <Badge
                            v-if="isCellSelected(sectionIndex, 0, index) && !section.data.length"
                            class="text-xs bg-sky-100"
                          >
                            ⭐
                          </Badge>

                          <!-- Icône graphique au hover -->
                          <button
                            v-if="isNumericColumn(section, index)"
                            @click.stop="handleChartIconClick(sectionIndex, index)"
                            :class="[
                              'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 cursor-pointer',
                            ]"
                          >
                            <BarChart3 class="w-4 h-4" />
                          </button>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow 
                      v-for="(row, rowIndex) in section.data" 
                      :key="rowIndex"
                      class="group"
                    >
                      <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
                        <div class="flex items-center gap-2">
                          {{ rowIndex + 1 }}
                          
                          <!-- ✨ Icône eye si au moins un graphique visible existe pour cette section -->
                          <button
                            v-if="hasVisibleChart(sectionIndex)"
                            @click="handleToggleRowInChart(sectionIndex, rowIndex)"
                            :class="[
                              'opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100',
                              isRowExcludedFromChart(sectionIndex, rowIndex) ? 'opacity-100' : ''
                            ]"
                            :title="isRowExcludedFromChart(sectionIndex, rowIndex) ? 'Inclure dans les graphiques' : 'Exclure des graphiques'"
                          >
                            <EyeOff 
                              v-if="isRowExcludedFromChart(sectionIndex, rowIndex)"
                              class="w-4 h-4 text-orange-500"
                            />
                            <Eye 
                              v-else
                              class="w-4 h-4 text-gray-400"
                            />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell
                        v-for="(cell, cellIndex) in row"
                        :key="cellIndex"
                        :class="[
                          'cursor-pointer hover:bg-blue-50',
                          isCellSelected(sectionIndex, rowIndex, cellIndex) ? 'bg-blue-100' : '',
                          isRowExcludedFromChart(sectionIndex, rowIndex) ? 'opacity-50' : '',
                        ]"
                        @click="handleCellClick(sectionIndex, rowIndex, cellIndex)"
                      >
                        <div class="flex items-center gap-2">
                          {{ formatCellValue(cell) }}
                          <Badge
                            v-if="isCellSelected(sectionIndex, rowIndex, cellIndex)"
                            class="text-xs bg-sky-100"
                          >
                            ⭐
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <!-- ✨ Graphiques de la section (peut en avoir plusieurs) -->
            <div v-if="section.charts && section.charts.length > 0" class="flex flex-col gap-4">
              <SectionChart 
                v-for="chart in section.charts.filter(c => c.visible)" 
                :key="`chart-${sectionIndex}-${chart.columnIndex}`"
                :section="section" 
                :section-index="sectionIndex"
                :chart="chart"
              />
            </div>
          </div>  

        </div>
      </div>
    </div>

    <!-- Fallback : affichage brut si pas de sections -->
    <div v-else class="border rounded-lg overflow-hidden">
      <div class="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
              <TableHead
                v-for="(header, index) in excelStore.currentSheet.rawData[0]"
                :key="index"
                class="min-w-[150px]"
              >
                {{ formatCellValue(header) || `Colonne ${index + 1}` }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(row, rowIndex) in excelStore.currentSheet.rawData.slice(1)"
              :key="rowIndex"
            >
              <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
                {{ rowIndex + 2 }}
              </TableCell>
              <TableCell v-for="(cell, cellIndex) in row" :key="cellIndex">
                {{ formatCellValue(cell) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>