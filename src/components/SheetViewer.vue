<script setup lang="ts">
import { computed } from 'vue'
import { excelStore, setCardRecap, setCurrentSheet } from '@/stores/excelStore'
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
import RecapCards from './RecapCards.vue'

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
  // if (!excelStore.selectionMode) return
  setCardRecap(sectionIndex, rowIndex, colIndex)
}

function handleHeaderClick(sectionIndex: number, colIndex: number) {
  if (excelStore.currentSheet.sections[sectionIndex]?.data.length) {
    return
  }
  setCardRecap(sectionIndex, 0, colIndex, true)
}

function isCellSelected(sectionIndex: number, rowIndex: number, colIndex: number): boolean {
  const section = excelStore.currentSheet.sections[sectionIndex]
  return section?.cardRecap?.rowIndex === rowIndex && section?.cardRecap?.colIndex === colIndex
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

          <!-- Tableau de la section -->
          <div class="border rounded-lg overflow-hidden">
            <div class="overflow-auto max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
                    <TableHead
                      v-for="(header, index) in section.header"
                      :key="index"
                      class="min-w-[150px]"
                      :class="[isCellSelected(sectionIndex, 0, index) ? 'bg-blue-100' : '']"
                      @click="handleHeaderClick(sectionIndex, index)"
                    >
                      {{ formatCellValue(header) || `Col ${index + 1}` }}
                      <Badge
                        v-if="isCellSelected(sectionIndex, 0, index)"
                        class="text-xs bg-sky-100"
                      >
                        ⭐
                      </Badge>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="(row, rowIndex) in section.data" :key="rowIndex">
                    <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
                      {{ rowIndex + 1 }}
                    </TableCell>
                    <TableCell
                      v-for="(cell, cellIndex) in row"
                      :key="cellIndex"
                      :class="[
                        'cursor-pointer hover:bg-blue-50',
                        isCellSelected(sectionIndex, rowIndex, cellIndex) ? 'bg-blue-100' : '',
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
