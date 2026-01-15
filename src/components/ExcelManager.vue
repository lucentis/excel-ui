<script setup lang="ts">
import { computed } from 'vue'
import { excelStore } from '@/stores/excelStore'
import ExcelImporter from './ExcelImporter.vue'
import SheetViewer from './SheetViewer.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Titre de l'app -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Excel Sublimé</h1>
        <p class="text-gray-600">Transformez vos tableaux Excel en interface moderne</p>
      </div>

      <!-- Importer -->
      <ExcelImporter />

      <!-- Visualiser les données -->
      <div v-if="excelStore.workbook" class="bg-white rounded-lg shadow p-6">
        <SheetViewer />
      </div>
    </div>
  </div>
</template>
