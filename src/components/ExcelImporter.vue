<script setup lang="ts">
import { ref } from 'vue'
import { Workbook } from 'exceljs'
import { Upload } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { setWorkbook, excelStore, getCurrentSheetInfo } from '@/stores/excelStore'

const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Vérifier que c'est bien un fichier Excel
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ]

  if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
    error.value = 'Veuillez sélectionner un fichier Excel (.xlsx ou .xls)'
    return
  }

  readExcelFile(file)
}

async function readExcelFile(file: File) {
  isLoading.value = true
  error.value = null

  try {
    // ExcelJS : créer un nouveau workbook
    const workbook = new Workbook()

    // Lire le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Parser le fichier Excel
    await workbook.xlsx.load(arrayBuffer)

    // Stocker dans le store
    setWorkbook(workbook, file.name)

    isLoading.value = false

    // Log des infos pour debug
    console.log('✅ Excel chargé avec ExcelJS:', {
      fileName: file.name,
      sheets: excelStore.sheetNames,
      sheetCount: excelStore.sheetNames.length,
      currentSheet: excelStore.currentSheetName,
      sheetInfo: getCurrentSheetInfo(),
      rawDataPreview: excelStore.rawData.slice(0, 5), // 5 premières lignes
    })
  } catch (err) {
    error.value = 'Erreur lors de la lecture du fichier'
    isLoading.value = false
    console.error('Erreur ExcelJS:', err)
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls"
        class="hidden"
        @change="handleFileSelect"
      />

      <Upload class="w-12 h-12 mx-auto mb-4 text-gray-400" />

      <h3 class="text-lg font-semibold mb-2">Importer un fichier Excel</h3>

      <p class="text-sm text-gray-600 mb-4">Glissez-déposez ou cliquez pour sélectionner</p>

      <Button @click="triggerFileInput" :disabled="isLoading">
        {{ isLoading ? 'Chargement...' : 'Sélectionner un fichier' }}
      </Button>

      <p v-if="error" class="mt-4 text-sm text-red-600">
        {{ error }}
      </p>
    </div>

    <!-- Affichage des infos si fichier chargé -->
    <div v-if="excelStore.workbook" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h4 class="font-semibold text-green-800 mb-2">✅ Fichier chargé</h4>
      <p class="text-sm text-green-700"><strong>Nom :</strong> {{ excelStore.fileName }}</p>
      <p class="text-sm text-green-700">
        <strong>Feuilles :</strong> {{ excelStore.sheetNames.join(', ') }}
      </p>
      <p class="text-sm text-green-700">
        <strong>Feuille active :</strong> {{ excelStore.currentSheetName }}
      </p>
      <p class="text-sm text-green-700">
        <strong>Lignes :</strong> {{ excelStore.rawData.length }}
      </p>
    </div>
  </div>
</template>
