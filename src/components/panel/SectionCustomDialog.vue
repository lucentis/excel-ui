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
import { Switch } from '@/components/ui/switch'
import { Donut } from '@unovis/ts'
import { ChartContainer, type ChartConfig } from '../ui/chart'
import { VisBulletLegend, VisDonut, VisSingleContainer, VisTooltip } from '@unovis/vue'
import { BarChart3, EyeOff, LineChart, PieChart, Settings2, Tag } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'

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

const TITLE_SIZE_OPTIONS = ['large', 'xlarge', '2xlarge'] as const
const CHART_POSITION_OPTIONS = ['right', 'left', 'bottom', 'top'] as const

// Local state (no logic yet)
const selectedTheme = ref('blue')
const titleSize = ref<typeof TITLE_SIZE_OPTIONS[number]>('xlarge')
const roundedBorders = ref(true)
const tableBorder = ref(true)
const alternatingRows = ref(true)
const chartPosition = ref<typeof CHART_POSITION_OPTIONS[number]>('left')

const chartPositionClass = {
  right:'flex-row-reverse items-start',
  left:'flex-row items-start',
  bottom:'flex-col',
  top:'flex-col-reverse',
}

const section = computed(() => {
  return excelStore.currentSheet.sections[props.sectionIndex]
})

const sectionTitle = computed(() => {
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

// Tooltip for pie chart with percentage
const pieTooltipTriggers = {
  [Donut.selectors.segment]: (d: any) => {
    const percentage = d.data.percentage?.toFixed(1) || '0.0'
    return `
      <div style="display:flex; flex-direction:column; gap:4px">
        <strong>${d.data.name}</strong>
        <span>${d.data.value} (${percentage}%)</span>
      </div>
    `
  }
}

const chartData = ref([
  {index: 1, name: 'Item 1', value: 100, percentage: 33.3},
  {index: 2, name: 'Item 2', value: 200, percentage: 66.6},
])

// Legend items with percentage for pie chart
const pieLegendItems = computed(() => {
  return chartData.value.map(item => ({
    name: `${item.name} (${item.percentage?.toFixed(1)}%)`
  }))
})

const chartConfig = {
  value: {
    label: 'ok',
    color: '#bada55',
  },
} satisfies ChartConfig
</script>

<template>
  <Dialog :open="true" @update:open="(open) => !open && handleClose()">
    <DialogContent class="max-h-[90vh] max-w-5xl!">
      <div class="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Section - {{ sectionTitle }}</DialogTitle>
          <DialogDescription>
            Personalize the appearance of this section
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

          <!-- Table Style -->
          <div class="space-y-3">
            <Label class="text-base font-semibold">Table Style</Label>

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
                  {{ size === '2xlarge' ? '2XL' : size === 'xlarge' ? 'XL' : 'L' }}
                </Button>
              </div>
            </div>

            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="flex items-center gap-8">
                  <Label for="rounded-borders" class="text-sm font-normal">Rounded Borders</Label>
                  <Switch id="rounded-borders" v-model="roundedBorders" />
                </div>

                <div class="flex items-center gap-8">
                  <Label for="table-border" class="text-sm font-normal">Show Borders</Label>
                  <Switch id="table-border" v-model="tableBorder" />
                </div>

                <div class="flex items-center gap-8">
                  <Label for="alternating-rows" class="text-sm font-normal">Alternating Rows</Label>
                  <Switch id="alternating-rows" v-model="alternatingRows" />
                </div>
              </div>

              
            </div>
          </div>

          <!-- Charts -->
          <div class="space-y-3">
            <Label class="text-base font-semibold">Charts</Label>

            <div class="grid grid-cols-2 gap-4">
              <!-- Position -->
              <div class="space-y-2">
                <Label class="text-xs text-gray-600">Position</Label>
                <div class="flex gap-2">
                  <Button
                    v-for="position in CHART_POSITION_OPTIONS"
                    :key="position"
                    @click="chartPosition = position"
                    :variant="chartPosition === position ? 'default' : 'outline'"
                    size="sm"
                    class="capitalize"
                  >
                    {{ position }}
                  </Button>
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
                <div :class="['h-1 w-8 rounded', currentTheme?.accent]"></div>
                <h3 :class="[
                  'font-semibold',
                  titleSize === 'large' ? 'text-lg' : titleSize === '2xlarge' ? 'text-2xl' : 'text-xl'
                ]">
                  {{ sectionTitle }}
                </h3>
              </div>

              <!-- Table preview -->
               <div class="flex gap-4" :class="[chartPositionClass[chartPosition]]">
                <div :class="['overflow-hidden grow', roundedBorders ? 'rounded-lg' : '', tableBorder ? 'border' : '']">
                  <table class="w-full text-sm">
                    <thead :class="[currentTheme?.bg, currentTheme?.text]">
                      <tr>
                        <th class="px-2 py-1.5 text-left font-medium">Name</th>
                        <th class="px-2 py-1.5 text-left font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr :class="alternatingRows ? 'hover:bg-gray-50' : ''">
                        <td class="px-2 py-1.5">Item 1</td>
                        <td class="px-2 py-1.5">100</td>
                      </tr>
                      <tr :class="alternatingRows ? 'bg-gray-50' : ''">
                        <td class="px-2 py-1.5">Item 2</td>
                        <td class="px-2 py-1.5">200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="p-4 border rounded-lg bg-white">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <BarChart3 class="w-5 h-5 text-blue-600" />
                        <h4 class="font-semibold text-gray-900">Chart title</h4>
                      </div>
                
                      <div class="flex items-center gap-2">
                        <!-- Type selector -->
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <Button variant="outline" size="sm">
                              <Settings2 class="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Chart type</DropdownMenuLabel>
                            <DropdownMenuItem >
                              <BarChart3 class="w-4 h-4 mr-2" />
                              Bar
                            </DropdownMenuItem>
                            <DropdownMenuItem >
                              <PieChart class="w-4 h-4 mr-2" />
                              Pie
                            </DropdownMenuItem>
                            <DropdownMenuItem >
                              <LineChart class="w-4 h-4 mr-2" />
                              Line
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <!-- Label column selector -->
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Tag class="w-4 h-4 mr-2" />
                                Labels: Some label
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  v-for="col in 3"
                                  :key="col"
                                >
                                  {{ col + ' label'}}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                
                        <!-- Hide button -->
                        <Button variant="ghost" size="sm" title="Hide chart">
                          <EyeOff class="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                

                
                    <!-- Pie Chart with percentage -->
                    <ChartContainer
                      :config="chartConfig"
                      class="h-[150px] w-80"
                    >
                      <VisSingleContainer :data="[
                        {index: 1, name: 'Item 1', value: 100},
                        {index: 2, name: 'Item 2', value: 200},
                      ]" :width="150" class="flex! items-center gap-4">
                        <VisTooltip :triggers="pieTooltipTriggers" />
                        
                        <VisBulletLegend 
                          :items="pieLegendItems"
                          orientation="vertical"
                        />
                
                        <VisDonut :value="(d: any) => d.value" :arc-width="50"/>
                      </VisSingleContainer>
                    </ChartContainer>
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