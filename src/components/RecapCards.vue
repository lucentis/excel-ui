<script setup lang="ts">
import { computed } from 'vue'
import { excelStore } from '@/stores/excelStore'
import { CardRecap } from '@/models'
import { getColorTheme, getCardPaddingClass, getTitleSizeClass, getValueSizeClass } from '@/lib/cardTheme'

const cardsData = computed(() => {
  return excelStore.currentSheet.sections
    .filter((section) => section.cardRecap)
    .map((section) => {
      const cardRecap = CardRecap.fromConfig(section.cardRecap!)
      return {
        title: section.title || section.cardRecap?.label,
        label: section.cardRecap?.label || 'Valeur',
        value: cardRecap.value,
        formattedValue: cardRecap.formatValue(),
        style: cardRecap.style,
      }
    })
})
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
        'rounded-lg border-2 transition-all hover:shadow-md flex justify-between',
        getColorTheme(card.style.colorTheme).bg,
        getColorTheme(card.style.colorTheme).border,
        getCardPaddingClass(card.style.size),
      ]"
    >
      <div>
        <!-- Header accent line -->
        <div class="flex items-center justify-between mb-3">
          <div :class="['h-1 w-12 rounded', getColorTheme(card.style.colorTheme).accent]"></div>
        </div>

        <!-- Title -->
        <div 
          :class="[
            'font-medium text-gray-600 mb-1',
            getTitleSizeClass(card.style.typography.titleSize)
          ]"
        >
          {{ card.title }}
        </div>

        <!-- Label -->
        <div class="text-xs text-gray-500">
          {{ card.label }}
        </div>
      </div>

      <div>
        <!-- Value -->
        <div 
          :class="[
            'font-bold mb-1',
            getColorTheme(card.style.colorTheme).text,
            getValueSizeClass(card.style.typography.valueSize)
          ]"
        >
          {{ card.formattedValue }}
        </div>
      </div>
    </div>
  </div>

  <!-- Message if no cards configured -->
  <div
    v-else
    class="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500"
  >
    <p class="text-sm">📌 Click on a cell to create a recap card</p>
  </div>
</template>