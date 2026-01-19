<script setup lang="ts">
import { computed } from 'vue'
import { excelStore } from '@/stores/excelStore'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

const cardsData = computed(() => {
  return excelStore.currentSheet.sections
    .filter((section) => section.cardRecap)
    .map((section) => ({
      title: section.title || section.cardRecap?.label,
      label: section.cardRecap?.label || 'Valeur',
      value: section.cardRecap?.value,
    }))
})

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'number') {
    return new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 2,
    }).format(value)
  }
  return String(value)
}

function isNumeric(value: unknown): boolean {
  return typeof value === 'number'
}

// Couleurs par index pour varier
const cardColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', accent: 'bg-blue-600' },
  {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    accent: 'bg-purple-600',
  },
  { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', accent: 'bg-green-600' },
  {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-900',
    accent: 'bg-orange-600',
  },
]

function getCardColor(index: number) {
  return cardColors[index % cardColors.length]
}
</script>

<template>
  <div
    v-if="cardsData.length > 0"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
  >
    <div
      v-for="(card, index) in cardsData"
      :key="index"
      :class="[
        'p-4 rounded-lg border-2 transition-all hover:shadow-md flex justify-between',
        getCardColor(index).bg,
        getCardColor(index).border,
      ]"
    >
      <div class="">
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <div :class="['h-1 w-12 rounded', getCardColor(index).accent]"></div>
        </div>

        <!-- Title -->
        <div class="text-sm font-medium text-gray-600 mb-1">
          {{ card.title }}
        </div>

        <!-- Label -->
        <div class="text-xs text-gray-500">
          {{ card.label }}
        </div>
      </div>

      <div class="">
        <!-- Value -->
        <div :class="['text-3xl font-bold mb-1', getCardColor(index).text]">
          {{ formatValue(card.value) }}
        </div>
      </div>
    </div>
  </div>

  <!-- Message si pas de cards configurées -->
  <div
    v-else
    class="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500"
  >
    <p class="text-sm">
      📌 Activez le mode sélection dans le panneau de configuration pour créer des cartes récap
    </p>
  </div>
</template>
