<script setup lang="ts">
import { ref, computed } from 'vue'
import { excelStore, updateSectionStyle } from '@/stores/excelStore'
import { Section } from '@/models'
import type { SectionStyleConfig } from '@/types'
import {
  SECTION_COLOR_THEMES,
  SECTION_TITLE_SIZE_OPTIONS,
  CHART_POSITION_OPTIONS,
  getSectionColorTheme,
  getSectionTitleSizeClass,
  getChartPositionClass,
  getTableBorderClass,
} from '@/lib/sectionTheme'
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

const section = computed(() => {
  return excelStore.currentSheet.sections[props.sectionIndex]
})

const sectionModel = computed(() => {
  return section.value ? Section.fromConfig(section.value) : null
})

const sectionTitle = computed(() => {
  return section.value?.title || `Section ${props.sectionIndex + 1}`
})

// Local state initialized from section config
const selectedTheme = ref(sectionModel.value?.style.colorTheme || 'blue')
const titleSize = ref(sectionModel.value?.style.titleSize || 'xlarge')
const roundedBorders = ref(sectionModel.value?.style.tableStyle.roundedBorders ?? true)
const tableBorder = ref(sectionModel.value?.style.tableStyle.showBorders ?? true)
const alternatingRows = ref(sectionModel.value?.style.tableStyle.alternatingRows ?? true)
const chartPosition = ref(sectionModel.value?.style.chartPosition || 'right')

const currentTheme = computed(() => getSectionColorTheme(selectedTheme.value))

const tableClasses = computed(() => {
  return getTableBorderClass(tableBorder.value, roundedBorders.value)
})

function handleClose() {
  emit('close')
}

function handleApply() {
  const newStyle: SectionStyleConfig = {
    colorTheme: selectedTheme.value,
    titleSize: titleSize.value,
    tableStyle: {
      showBorders: tableBorder.value,
      roundedBorders: roundedBorders.value,
      alternatingRows: alternatingRows.value,
    },
    chartPosition: chartPosition.value,
  }

  updateSectionStyle(props.sectionIndex, newStyle)
  emit('close')
}

// Mock data for preview
const chartData = ref([
  { index: 1, name: 'Item 1', value: 100, percentage: 33.3 },
  { index: 2, name: 'Item 2', value: 200, percentage: 66.6 },
])

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

const pieLegendItems = computed(() => {
  return chartData.value.map(item => ({
    name: `${item.name} (${item.percentage?.toFixed(1)}%)`
  }))
})

const chartConfig = {
  value: {
    label: 'Value',
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
                v-for="theme in SECTION_COLOR_THEMES"
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
                  v-for="size in SECTION_TITLE_SIZE_OPTIONS"
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
                <div :class="['h-1 w-8 rounded', currentTheme.accent]"></div>
                <h3 :class="[
                  'font-semibold',
                  getSectionTitleSizeClass(titleSize)
                ]">
                  {{ sectionTitle }}
                </h3>
              </div>

              <!-- Table and chart preview -->
              <div class="flex gap-4" :class="[getChartPositionClass(chartPosition)]">
                <div :class="['overflow-hidden grow', tableClasses]">
                  <table class="w-full text-sm">
                    <thead :class="[currentTheme.bg, currentTheme.text]">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button variant="outline" size="sm">
                            <Settings2 class="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Chart type</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <BarChart3 class="w-4 h-4 mr-2" />
                            Bar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PieChart class="w-4 h-4 mr-2" />
                            Pie
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <LineChart class="w-4 h-4 mr-2" />
                            Line
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
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
              
                      <Button variant="ghost" size="sm" title="Hide chart">
                        <EyeOff class="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              
                  <ChartContainer
                    :config="chartConfig"
                    class="h-[150px] w-80"
                  >
                    <VisSingleContainer :data="chartData" :width="150" class="flex! items-center gap-4">
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