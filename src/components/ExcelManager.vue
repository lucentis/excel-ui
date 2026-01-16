<script setup lang="ts">
import { excelStore } from '@/stores/excelStore'
import ExcelImporter from './ExcelImporter.vue'
import SheetViewer from './SheetViewer.vue'
import ConfigPanel from './ConfigPanel.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="h-screen flex flex-col">
      <!-- Header -->
      <div class="bg-white border-b px-6 py-2">
        <h1 class="text-2xl font-bold text-gray-900">Excel Sublimé</h1>
        <p class="text-sm text-gray-600 mt-1">
          Transformez vos tableaux Excel en interface moderne
        </p>
      </div>

      <!-- Main content -->
      <div class="flex-1 flex">
        <!-- Left: Content area -->
        <div class="flex-1 overflow-auto">
          <div class="p-4 space-y-6">
            <!-- Importer si pas de fichier -->
            <ExcelImporter v-if="!excelStore.workbook" />

            <!-- Visualiser si fichier chargé -->
            <div v-else class="bg-white rounded-lg shadow p-4">
              <SheetViewer />
            </div>
          </div>
        </div>

        <!-- Right: Config Panel -->
        <ConfigPanel v-if="excelStore.workbook" />
      </div>
    </div>
  </div>
</template>
