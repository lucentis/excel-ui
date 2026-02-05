<script setup lang="ts">
import { ref, computed } from 'vue'
import { excelStore } from '@/stores/excelStore'
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

const COLOR_THEMES = [
  { id: 'slate', label: 'Slate', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', accent: 'bg-slate-600' },
  { id: 'neutral', label: 'Neutral', bg: 'bg-neutral-50', border: 'border-neutral-200', text: 'text-neutral-900', accent: 'bg-neutral-600' },
  { id: 'red', label: 'Red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', accent: 'bg-red-600' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', accent: 'bg-orange-600' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', accent: 'bg-amber-600' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', accent: 'bg-yellow-600' },
  { id: 'lime', label: 'Lime', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-900', accent: 'bg-lime-600' },
  { id: 'green', label: 'Green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', accent: 'bg-green-600' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', accent: 'bg-emerald-600' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-900', accent: 'bg-teal-600' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-900', accent: 'bg-cyan-600' },
  { id: 'sky', label: 'Sky', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', accent: 'bg-sky-600' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', accent: 'bg-blue-600' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-900', accent: 'bg-indigo-600' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-900', accent: 'bg-violet-600' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', accent: 'bg-purple-600' },
  { id: 'fuchsia', label: 'Fuchsia', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-900', accent: 'bg-fuchsia-600' },
  { id: 'pink', label: 'Pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-900', accent: 'bg-pink-600' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', accent: 'bg-rose-600' },
]

const SIZE_OPTIONS = ['small', 'medium', 'large'] as const
const ICON_POSITION_OPTIONS = ['top', 'left', 'right', 'none'] as const
const VALUE_FORMAT_OPTIONS = [
  { id: 'number', label: 'Number' },
  { id: 'integer', label: 'Integer' },
  { id: 'percentage', label: '%' },
  { id: 'currency', label: '€' },
] as const
const TITLE_SIZE_OPTIONS = ['small', 'medium', 'large'] as const
const VALUE_SIZE_OPTIONS = ['small', 'medium', 'large', 'xlarge'] as const

// Local state (no logic yet)
const selectedTheme = ref('blue')
const cardSize = ref<typeof SIZE_OPTIONS[number]>('medium')
const iconPosition = ref<typeof ICON_POSITION_OPTIONS[number]>('left')
const valueFormat = ref('number')
const customUnit = ref('€')
const titleSize = ref<typeof TITLE_SIZE_OPTIONS[number]>('medium')
const valueSize = ref<typeof VALUE_SIZE_OPTIONS[number]>('large')

const section = computed(() => {
  return excelStore.currentSheet.sections[props.sectionIndex]
})

const cardTitle = computed(() => {
  return section.value?.title || `Section ${props.sectionIndex + 1}`
})

const currentTheme = computed(() => {
  return COLOR_THEMES.find(t => t.id === selectedTheme.value) || COLOR_THEMES[0]
})

function handleClose() {
  emit('close')
}

function handleApply() {
  // TODO: Apply changes
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
                    v-for="size in SIZE_OPTIONS"
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
                    v-for="position in ICON_POSITION_OPTIONS"
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
                    v-for="size in TITLE_SIZE_OPTIONS"
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
                    v-for="size in VALUE_SIZE_OPTIONS"
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
                v-for="format in VALUE_FORMAT_OPTIONS"
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
                'p-4 rounded-lg border-2 transition-all flex justify-between',
                currentTheme?.bg,
                currentTheme?.border,
                cardSize === 'small' ? 'p-3' : cardSize === 'large' ? 'p-6' : 'p-4',
              ]"
            >
              <div>
                <div :class="['h-1 w-12 rounded mb-3', currentTheme?.accent]"></div>
                <div :class="[
                  'font-medium mb-1',
                  titleSize === 'small' ? 'text-xs' : titleSize === 'large' ? 'text-base' : 'text-sm'
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
                  currentTheme?.text,
                  valueSize === 'small' ? 'text-xl' : valueSize === 'medium' ? 'text-2xl' : valueSize === 'large' ? 'text-3xl' : 'text-4xl'
                ]">
                  1,234
                  <span v-if="valueFormat === 'percentage'">%</span>
                  <span v-if="valueFormat === 'currency'">{{ customUnit }}</span>
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