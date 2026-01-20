<script setup lang="ts">
import { computed } from 'vue'
import type { Section } from '@/types'
import type { ChartConfig } from '@/components/ui/chart'
import { prepareChartData, getChartValueLabel } from '@/utils/chartManager'
import { setChartType, toggleSectionChart } from '@/stores/excelStore'
import { BarChart3, PieChart, LineChart, Settings2, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChartContainer,
  ChartTooltip,
  ChartCrosshair,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'
import { VisXYContainer, VisGroupedBar, VisLine, VisDonut, VisAxis } from '@unovis/vue'

const props = defineProps<{
  section: Section
  sectionIndex: number
}>()

const chartData = computed(() => {
  if (!props.section.chart) return []
  return prepareChartData(props.section, props.section.chart)
})

const valueLabel = computed(() => {
  if (!props.section.chart) return ''
  return getChartValueLabel(props.section, props.section.chart)
})

const chartConfig = computed(
  () =>
    ({
      value: {
        label: valueLabel.value,
        color: '#bada55',
      },
    }) satisfies ChartConfig,
)

type ChartDataType = { index: number; name: string; value: number }

function handleTypeChange(type: 'bar' | 'pie' | 'line') {
  setChartType(props.sectionIndex, type)
}

function handleRemoveChart() {
  if (props.section.chart) {
    toggleSectionChart(props.sectionIndex, props.section.chart.columnIndex)
  }
}
</script>

<template>
  <div v-if="section.chart" class="mb-4 p-4 border rounded-lg bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <BarChart3 class="w-5 h-5 text-blue-600" />
        <h4 class="font-semibold text-gray-900">{{ valueLabel }}</h4>
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
            <DropdownMenuItem @click="handleTypeChange('bar')">
              <BarChart3 class="w-4 h-4 mr-2" />
              Barres
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleTypeChange('pie')">
              <PieChart class="w-4 h-4 mr-2" />
              Camembert
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleTypeChange('line')">
              <LineChart class="w-4 h-4 mr-2" />
              Lignes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Remove button -->
        <Button variant="ghost" size="sm" @click="handleRemoveChart">
          <X class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Bar Chart -->
    <ChartContainer
      v-if="section.chart.type === 'bar'"
      :config="chartConfig"
      class="h-[300px] w-full"
    >
      <VisXYContainer :data="chartData">
        <VisGroupedBar
          :x="(d: ChartDataType) => d.index"
          :y="(d: ChartDataType) => d.value"
          :color="chartConfig.value.color"
          :rounded-corners="4"
        />
        <VisAxis
          type="x"
          :x="(d: ChartDataType) => d.index"
          :tick-line="false"
          :domain-line="false"
          :tick-values="chartData.map((d) => d.index)"
          :tick-format="(i: number) => chartData[i]?.name || ''"
        />
        <VisAxis type="y" :tick-line="false" :domain-line="false" :grid-line="true" />
        <ChartTooltip />
        <ChartCrosshair
          :template="
            componentToString(chartConfig, ChartTooltipContent, {
              labelFormatter: (d: number | Date) => {
                const index = typeof d === 'number' ? d : d.getTime()
                return chartData[index]?.name || ''
              },
            })
          "
          :color="[chartConfig.value.color]"
        />
      </VisXYContainer>
    </ChartContainer>

    <!-- Pie Chart -->
    <ChartContainer
      v-else-if="section.chart.type === 'pie'"
      :config="chartConfig"
      class="h-[300px] w-full"
    >
      <VisDonut :data="chartData" :value="(d: ChartDataType) => d.value" :arc-width="80" />
    </ChartContainer>

    <!-- Line Chart -->
    <ChartContainer
      v-else-if="section.chart.type === 'line'"
      :config="chartConfig"
      class="h-[300px] w-full"
    >
      <VisXYContainer :data="chartData">
        <VisLine
          :x="(d: ChartDataType) => d.index"
          :y="(d: ChartDataType) => d.value"
          :color="chartConfig.value.color"
        />
        <VisAxis
          type="x"
          :x="(d: ChartDataType) => d.index"
          :tick-line="false"
          :domain-line="false"
          :tick-format="(i: number) => chartData[i]?.name || ''"
        />
        <VisAxis type="y" :tick-line="false" :domain-line="false" :grid-line="true" />
        <ChartTooltip />
        <ChartCrosshair
          :template="
            componentToString(chartConfig, ChartTooltipContent, {
              labelFormatter: (i: number) => chartData[i]?.name || '',
            })
          "
          :color="[chartConfig.value.color]"
        />
      </VisXYContainer>
    </ChartContainer>
  </div>
</template>
