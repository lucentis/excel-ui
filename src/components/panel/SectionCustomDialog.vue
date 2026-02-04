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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

const props = defineProps<{
  sectionIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

const TITLE_COLORS = [
  { id: 'dark', label: 'Dark', class: 'text-gray-900' },
  { id: 'blue', label: 'Blue', class: 'text-blue-600' },
  { id: 'purple', label: 'Purple', class: 'text-purple-600' },
  { id: 'green', label: 'Green', class: 'text-green-600' },
]

const ACCENT_COLORS = [
  { id: 'blue', label: 'Blue', class: 'bg-blue-600' },
  { id: 'purple', label: 'Purple', class: 'bg-purple-600' },
  { id: 'green', label: 'Green', class: 'bg-green-600' },
  { id: 'orange', label: 'Orange', class: 'bg-orange-600' },
  { id: 'red', label: 'Red', class: 'bg-red-600' },
]

const HEADER_BG_COLORS = [
  { id: 'gray-50', label: 'Gray Light', class: 'bg-gray-50' },
  { id: 'blue-50', label: 'Blue Light', class: 'bg-blue-50' },
  { id: 'purple-50', label: 'Purple Light', class: 'bg-purple-50' },
]

// Local state (no logic yet)
const titleColor = ref('dark')
const titleSize = ref('xlarge')
const accentBar = ref('blue')
const roundedBorders = ref(true)
const tableBorder = ref(true)
const headerBg = ref('gray-50')
const alternatingRows = ref(true)
const spacing = ref('normal')
const chartPosition = ref('right')
const chartSize = ref('medium')
const chartColor = ref('blue')

const section = computed(() => {
  return excelStore.currentSheet.sections[props.sectionIndex]
})

const sectionTitle = computed(() => {
  return section.value?.title || `Section ${props.sectionIndex + 1}`
})

const currentTitleColor = computed(() => {
  return TITLE_COLORS.find(c => c.id === titleColor.value) || TITLE_COLORS[0]
})

const currentAccentColor = computed(() => {
  return ACCENT_COLORS.find(c => c.id === accentBar.value) || ACCENT_COLORS[0]
})

const currentHeaderBg = computed(() => {
  return HEADER_BG_COLORS.find(c => c.id === headerBg.value) || HEADER_BG_COLORS[0]
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
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Customize Section - {{ sectionTitle }}</DialogTitle>
        <DialogDescription>
          Personalize the appearance of this section
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 py-4">
        <!-- Header Style -->
        <div class="space-y-3">
          <Label class="text-base font-semibold">Header Style</Label>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label for="title-color" class="text-xs text-gray-600">Title Color</Label>
              <Select v-model="titleColor">
                <SelectTrigger id="title-color" class="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="color in TITLE_COLORS" :key="color.id" :value="color.id">
                    {{ color.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label for="title-size" class="text-xs text-gray-600">Title Size</Label>
              <Select v-model="titleSize">
                <SelectTrigger id="title-size" class="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">X-Large</SelectItem>
                  <SelectItem value="2xlarge">2X-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label for="accent-bar" class="text-xs text-gray-600">Accent Bar Color</Label>
            <div class="grid grid-cols-5 gap-2 mt-2">
              <button
                v-for="color in ACCENT_COLORS"
                :key="color.id"
                @click="accentBar = color.id"
                :class="[
                  'h-10 rounded border-2 transition-all',
                  color.class,
                  accentBar === color.id ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-transparent',
                ]"
                :title="color.label"
              />
            </div>
          </div>
        </div>

        <!-- Table Style -->
        <div class="space-y-3">
          <Label class="text-base font-semibold">Table Style</Label>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <Label for="rounded-borders" class="text-sm font-normal">Rounded Borders</Label>
              <Switch id="rounded-borders" v-model:checked="roundedBorders" />
            </div>

            <div class="flex items-center justify-between">
              <Label for="table-border" class="text-sm font-normal">Show Borders</Label>
              <Switch id="table-border" v-model:checked="tableBorder" />
            </div>

            <div>
              <Label for="header-bg" class="text-xs text-gray-600">Header Background</Label>
              <Select v-model="headerBg">
                <SelectTrigger id="header-bg" class="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="bg in HEADER_BG_COLORS" :key="bg.id" :value="bg.id">
                    {{ bg.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center justify-between">
              <Label for="alternating-rows" class="text-sm font-normal">Alternating Rows</Label>
              <Switch id="alternating-rows" v-model:checked="alternatingRows" />
            </div>

            <div>
              <Label class="text-xs text-gray-600 mb-2 block">Cell Spacing</Label>
              <RadioGroup v-model="spacing" class="flex gap-4">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="spacing-compact" />
                  <Label for="spacing-compact" class="font-normal cursor-pointer">Compact</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="spacing-normal" />
                  <Label for="spacing-normal" class="font-normal cursor-pointer">Normal</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="spacious" id="spacing-spacious" />
                  <Label for="spacing-spacious" class="font-normal cursor-pointer">Spacious</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="space-y-3">
          <Label class="text-base font-semibold">Charts</Label>

          <div class="space-y-3">
            <div>
              <Label class="text-xs text-gray-600 mb-2 block">Position</Label>
              <RadioGroup v-model="chartPosition" class="flex gap-4">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="chart-right" />
                  <Label for="chart-right" class="font-normal cursor-pointer">Right</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="bottom" id="chart-bottom" />
                  <Label for="chart-bottom" class="font-normal cursor-pointer">Bottom</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="hidden" id="chart-hidden" />
                  <Label for="chart-hidden" class="font-normal cursor-pointer">Hidden</Label>
                </div>
              </RadioGroup>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <Label for="chart-size" class="text-xs text-gray-600">Size</Label>
                <Select v-model="chartSize">
                  <SelectTrigger id="chart-size" class="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="chart-color" class="text-xs text-gray-600">Color</Label>
                <Select v-model="chartColor">
                  <SelectTrigger id="chart-color" class="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="space-y-2">
          <Label>Preview</Label>
          <div class="border rounded-lg p-4 bg-white">
            <!-- Header preview -->
            <div class="flex items-center gap-3 mb-3">
              <div :class="['h-1 w-8 rounded', currentAccentColor?.class]"></div>
              <h3 :class="[
                'font-semibold',
                currentTitleColor?.class,
                titleSize === 'large' ? 'text-lg' : titleSize === '2xlarge' ? 'text-2xl' : 'text-xl'
              ]">
                {{ sectionTitle }}
              </h3>
            </div>

            <!-- Table preview -->
            <div :class="['border overflow-hidden', roundedBorders ? 'rounded-lg' : '']">
              <table class="w-full text-sm">
                <thead :class="[currentHeaderBg?.class]">
                  <tr>
                    <th class="px-2 py-1.5 text-left font-medium">Name</th>
                    <th class="px-2 py-1.5 text-left font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr :class="alternatingRows ? 'hover:bg-gray-50' : ''">
                    <td :class="spacing === 'compact' ? 'px-2 py-1' : spacing === 'spacious' ? 'px-3 py-2' : 'px-2 py-1.5'">Item 1</td>
                    <td :class="spacing === 'compact' ? 'px-2 py-1' : spacing === 'spacious' ? 'px-3 py-2' : 'px-2 py-1.5'">100</td>
                  </tr>
                  <tr :class="alternatingRows ? 'bg-gray-50/50' : ''">
                    <td :class="spacing === 'compact' ? 'px-2 py-1' : spacing === 'spacious' ? 'px-3 py-2' : 'px-2 py-1.5'">Item 2</td>
                    <td :class="spacing === 'compact' ? 'px-2 py-1' : spacing === 'spacious' ? 'px-3 py-2' : 'px-2 py-1.5'">200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancel</Button>
        <Button @click="handleApply">Apply</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>