<script setup lang="ts">
import { computed } from 'vue'
import { excelStore, setCurrentSheet } from '@/stores/excelStore'
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
import { Sheet } from 'lucide-vue-next'

// Données à afficher
const hasData = computed(() => excelStore.rawData.length > 0)
const headers = computed(() => excelStore.rawData[0] || [])
const rows = computed(() => excelStore.rawData.slice(1))

// Formater les valeurs pour l'affichage
function formatCellValue(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return value.toLocaleString('fr-FR')
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (value instanceof Date) return value.toLocaleDateString('fr-FR')
  return String(value)
}

// Changer de feuille
function handleSheetChange(sheetName: string) {
  setCurrentSheet(sheetName)
}
</script>

<template>
  <div class="w-full space-y-4">
    <!-- En-tête avec sélecteur de feuille -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Sheet class="w-5 h-5 text-gray-600" />
        <h2 class="text-xl font-semibold">{{ excelStore.currentSheetName }}</h2>
        <span class="text-sm text-gray-500"> ({{ excelStore.rawData.length }} lignes) </span>
      </div>

      <!-- Sélecteur de feuille si plusieurs -->
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
            {{ sheetName }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Message si pas de données -->
    <div v-if="!hasData" class="text-center py-12 text-gray-500">Aucune donnée à afficher</div>

    <!-- Tableau des données -->
    <div v-else class="border rounded-lg overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            <!-- Colonne index -->
            <TableHead class="w-12 bg-gray-50 sticky left-0 z-10">#</TableHead>
            <!-- En-têtes des colonnes -->
            <TableHead v-for="(header, index) in headers" :key="index" class="min-w-[150px]">
              {{ formatCellValue(header) || `Colonne ${index + 1}` }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, rowIndex) in rows" :key="rowIndex">
            <!-- Numéro de ligne -->
            <TableCell class="bg-gray-50 font-medium sticky left-0 z-10">
              {{ rowIndex + 2 }}
            </TableCell>
            <!-- Cellules -->
            <TableCell v-for="(cell, cellIndex) in row" :key="cellIndex">
              {{ formatCellValue(cell) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
