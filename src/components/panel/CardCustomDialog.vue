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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  sectionIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

const COLOR_THEMES = [
  { id: 'blue', label: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', accent: 'bg-blue-600' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', accent: 'bg-purple-600' },
  { id: 'green', label: 'Green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', accent: 'bg-green-600' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900', accent: 'bg-orange-600' },
  { id: 'red', label: 'Red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', accent: 'bg-red-600' },
  { id: 'gray', label: 'Gray', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-900', accent: 'bg-gray-600' },
]

// Local state (no logic yet)
const selectedTheme = ref('blue')
const cardSize = ref('medium')
const iconPosition = ref('left')
const valueFormat = ref('number')
const customUnit = ref('€')
const titleSize = ref('medium')
const valueSize = ref('large')

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
    <DialogContent class="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Customize Card - {{ cardTitle }}</DialogTitle>
        <DialogDescription>
          Personalize the appearance of this recap card
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 py-4">
        <!-- Color Theme -->
        <div class="space-y-3">
          <Label>Color Theme</Label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="theme in COLOR_THEMES"
              :key="theme.id"
              @click="selectedTheme = theme.id"
              :class="[
                'p-3 rounded-lg border-2 transition-all',
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
          <div class="space-y-3">
            <div>
              <Label class="text-xs text-gray-600 mb-2 block">Size</Label>
              <RadioGroup v-model="cardSize" class="flex gap-4">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="size-small" />
                  <Label for="size-small" class="font-normal cursor-pointer">Small</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="size-medium" />
                  <Label for="size-medium" class="font-normal cursor-pointer">Medium</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="size-large" />
                  <Label for="size-large" class="font-normal cursor-pointer">Large</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label class="text-xs text-gray-600 mb-2 block">Icon Position</Label>
              <RadioGroup v-model="iconPosition" class="flex gap-4">
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="top" id="icon-top" />
                  <Label for="icon-top" class="font-normal cursor-pointer">Top</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="icon-left" />
                  <Label for="icon-left" class="font-normal cursor-pointer">Left</Label>
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="icon-right" />
                  <Label for="icon-right" class="font-normal cursor-pointer">Right</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <!-- Value Format -->
        <div class="space-y-3">
          <Label>Value Format</Label>
          <RadioGroup v-model="valueFormat" class="grid grid-cols-2 gap-2">
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="number" id="format-number" />
              <Label for="format-number" class="font-normal cursor-pointer">Number (1,234.56)</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="integer" id="format-integer" />
              <Label for="format-integer" class="font-normal cursor-pointer">Integer (1,235)</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="format-percentage" />
              <Label for="format-percentage" class="font-normal cursor-pointer">Percentage (45%)</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem value="currency" id="format-currency" />
              <Label for="format-currency" class="font-normal cursor-pointer">Currency</Label>
            </div>
          </RadioGroup>

          <div v-if="valueFormat === 'currency'" class="pt-2">
            <Label for="unit" class="text-xs text-gray-600">Custom Unit</Label>
            <Input id="unit" v-model="customUnit" placeholder="€" class="mt-1" />
          </div>
        </div>

        <!-- Typography -->
        <div class="space-y-3">
          <Label>Typography</Label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <Label for="title-size" class="text-xs text-gray-600">Title Size</Label>
              <Select v-model="titleSize">
                <SelectTrigger id="title-size" class="mt-1">
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
              <Label for="value-size" class="text-xs text-gray-600">Value Size</Label>
              <Select v-model="valueSize">
                <SelectTrigger id="value-size" class="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">X-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            ]"
          >
            <div>
              <div :class="['h-1 w-12 rounded mb-3', currentTheme?.accent]"></div>
              <div :class="['font-medium mb-1', titleSize === 'small' ? 'text-xs' : titleSize === 'large' ? 'text-base' : 'text-sm']">
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
    </DialogContent>
  </Dialog>
</template>