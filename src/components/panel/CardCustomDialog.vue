<script setup lang="ts">
import { ref, computed } from 'vue'
import { excelStore, updateCardStyle } from '@/stores/excelStore'
import { CardRecap } from '@/models'
import type { CardStyleConfig } from '@/types'
import {
  COLOR_THEMES,
  CARD_SIZE_OPTIONS,
  CARD_ICON_POSITION_OPTIONS,
  CARD_TITLE_SIZE_OPTIONS,
  CARD_VALUE_SIZE_OPTIONS,
  CARD_VALUE_FORMAT_OPTIONS,
  getColorTheme,
  getCardPaddingClass,
  getTitleSizeClass,
  getValueSizeClass,
} from '@/lib/cardTheme'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  sectionIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

const section = computed(() => {
  return excelStore.currentSheet.sections[props.sectionIndex]
})

const cardRecap = computed(() => {
  return section.value?.cardRecap 
    ? CardRecap.fromConfig(section.value.cardRecap)
    : null
})

const cardTitle = computed(() => {
  return section.value?.title || `Section ${props.sectionIndex + 1}`
})

// Local state initialized from card config
const selectedTheme = ref(cardRecap.value?.style.colorTheme || 'blue')
const cardSize = ref(cardRecap.value?.style.size || 'medium')
const iconPosition = ref(cardRecap.value?.style.iconPosition || 'left')
const titleSize = ref(cardRecap.value?.style.typography.titleSize || 'medium')
const valueSize = ref(cardRecap.value?.style.typography.valueSize || 'large')
const valueFormat = ref(cardRecap.value?.style.valueFormat.type || 'number')
const customUnit = ref(cardRecap.value?.style.valueFormat.customUnit || '€')

const currentTheme = computed(() => getColorTheme(selectedTheme.value))

const previewValue = computed(() => {
  if (!cardRecap.value) return '1,234'
  
  const value = cardRecap.value.value
  if (typeof value.value !== 'number') return String(value)

  switch (valueFormat.value) {
    case 'integer':
      return Math.round(value.value).toLocaleString('fr-FR')
    case 'percentage':
      return `${value.value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}%`
    case 'currency':
      return `${value.value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${customUnit.value}`
    default:
      return value.value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
  }
})

function handleClose() {
  emit('close')
}

function handleApply() {
  if (!cardRecap.value) return

  const newStyle: CardStyleConfig = {
    colorTheme: selectedTheme.value,
    size: cardSize.value,
    iconPosition: iconPosition.value,
    typography: {
      titleSize: titleSize.value,
      valueSize: valueSize.value,
    },
    valueFormat: {
      type: valueFormat.value,
      customUnit: valueFormat.value === 'currency' ? customUnit.value : undefined,
    },
  }

  updateCardStyle(props.sectionIndex, newStyle)
  console.log('New style:', newStyle);
  
  emit('close')
}
</script>

<template>
  <Dialog :open="true" @update:open="(open) => !open && handleClose()">
    <DialogContent class="max-h-[90vh] max-w-5xl!">
      <div class="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Card - {{ cardTitle }}</DialogTitle>
          <DialogDescription>
            Personalize the appearance of this recap card
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-6 py-4 overflow-y-auto overflow-x-hidden">
          <!-- Color Theme -->
          <div class="space-y-3">
            <Label>Color Theme</Label>
            <div class="grid grid-cols-12 gap-2">
              <button
                v-for="theme in COLOR_THEMES"
                :key="theme.id"
                @click="selectedTheme = theme.id"
                :class="[
                  'p-3 rounded-lg border-2 transition-all hover:scale-105',
                  theme.bg,
                  selectedTheme === theme.id ? theme.border : 'border-transparent',
                ]"
              >
                <div :class="['h-1 w-full rounded mb-2', theme.accent]"></div>
                <div :class="['text-xs font-medium', theme.text]">{{ theme.label }}</div>
              </button>
            </div>
          </div>

          <!-- Layout -->
          <div class="space-y-3">
            <Label>Layout</Label>

            <div class="grid grid-cols-2 gap-4">
              <!-- Size -->
              <div class="space-y-2">
                <Label class="text-xs text-gray-600">Size</Label>
                <div class="flex gap-2">
                  <Button
                    v-for="size in CARD_SIZE_OPTIONS"
                    :key="size"
                    @click="cardSize = size"
                    :variant="cardSize === size ? 'default' : 'outline'"
                    size="sm"
                    class="capitalize"
                  >
                    {{ size }}
                  </Button>
                </div>
              </div>

              <!-- Icon Position -->
              <div class="space-y-2">
                <Label class="text-xs text-gray-600">Icon Position</Label>
                <div class="flex gap-2">
                  <Button
                    v-for="position in CARD_ICON_POSITION_OPTIONS"
                    :key="position"
                    @click="iconPosition = position"
                    :variant="iconPosition === position ? 'default' : 'outline'"
                    size="sm"
                    class="capitalize"
                  >
                    {{ position }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="space-y-3">
            <Label>Typography</Label>
            <div class="grid grid-cols-2 gap-4">
              <!-- Title Size -->
              <div class="space-y-2">
                <Label class="text-xs text-gray-600">Title Size</Label>
                <div class="flex gap-2">
                  <Button
                    v-for="size in CARD_TITLE_SIZE_OPTIONS"
                    :key="size"
                    @click="titleSize = size"
                    :variant="titleSize === size ? 'default' : 'outline'"
                    size="sm"
                    class="uppercase text-xs"
                  >
                    {{ size.charAt(0) }}
                  </Button>
                </div>
              </div>

              <!-- Value Size -->
              <div class="space-y-2">
                <Label class="text-xs text-gray-600">Value Size</Label>
                <div class="flex gap-2">
                  <Button
                    v-for="size in CARD_VALUE_SIZE_OPTIONS"
                    :key="size"
                    @click="valueSize = size"
                    :variant="valueSize === size ? 'default' : 'outline'"
                    size="sm"
                    class="uppercase text-xs"
                  >
                    {{ size === 'xlarge' ? 'XL' : size.charAt(0) }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Value Format -->
          <div class="space-y-3">
            <Label>Value Format</Label>
            <div class="flex gap-2 flex-wrap">
              <Button
                v-for="format in CARD_VALUE_FORMAT_OPTIONS"
                :key="format.id"
                @click="valueFormat = format.id"
                :variant="valueFormat === format.id ? 'default' : 'outline'"
                size="sm"
              >
                {{ format.label }}
              </Button>
            </div>

            <div v-if="valueFormat === 'currency'" class="pt-2">
              <Label for="unit" class="text-xs text-gray-600">Custom Unit</Label>
              <Input id="unit" v-model="customUnit" placeholder="€" class="mt-1 max-w-[200px]" />
            </div>
          </div>

          <!-- Preview -->
          <div class="space-y-2">
            <Label>Preview</Label>
            <div
              :class="[
                'rounded-lg border-2 transition-all flex justify-between',
                currentTheme.bg,
                currentTheme.border,
                getCardPaddingClass(cardSize),
              ]"
            >
              <div>
                <div :class="['h-1 w-12 rounded mb-3', currentTheme.accent]"></div>
                <div :class="[
                  'font-medium mb-1',
                  getTitleSizeClass(titleSize)
                ]">
                  {{ section?.title || 'Card Title' }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ section?.cardRecap?.label || 'Label' }}
                </div>
              </div>
              <div>
                <div :class="[
                  'font-bold mb-1',
                  currentTheme.text,
                  getValueSizeClass(valueSize)
                ]">
                  {{ previewValue }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="handleClose">Cancel</Button>
          <Button @click="handleApply">Apply</Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>