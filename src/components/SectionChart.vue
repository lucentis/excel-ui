<script setup lang="ts">
import { computed } from 'vue'
import type { SectionConfig, ChartConfig as ChartConfigType } from '@/types'
import type { ChartConfig } from '@/components/ui/chart'
import { Chart, Section } from '@/models'
import { ChartService } from '@/services'
import { setChartType, toggleSectionChart, setChartLabelColumn } from '@/stores/excelStore'
import { BarChart3, PieChart, LineChart, Settings2, EyeOff, Tag } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import {
  ChartContainer,
  ChartTooltip,
  ChartCrosshair,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'
import {
  VisXYContainer,
  VisGroupedBar,
  VisLine,
  VisDonut,
  VisAxis,
  VisSingleContainer,
  VisTooltip,
  VisBulletLegend
} from '@unovis/vue'
import { Donut } from '@unovis/ts'

const triggers = {
  [Donut.selectors.segment]: (d: any ) => {
    return `
      <div style="display:flex; flex-direction:column; gap:4px">
        <strong>${d.data.name}</strong>
        <span>${d.data.value}</span>
      </div>
    `
  }
}

const props = defineProps<{
  section: SectionConfig
  sectionIndex: number
  chart: ChartConfigType
}>()

// Convert to models for business logic
const sectionModel = computed(() => Section.fromConfig(props.section))
const chartModel = computed(() => Chart.fromConfig(props.chart))

const chartData = computed(() => {
  return ChartService.prepareChartData(props.section, chartModel.value)
})

const valueLabel = computed(() => {
  return ChartService.getChartValueLabel(props.section, chartModel.value)
})

const labelCandidates = computed(() => {
  return ChartService.getLabelCandidateColumns(props.section)
})

const currentLabelColumn = computed(() => {
  const col = labelCandidates.value.find(c => c.index === props.chart.labelColumnIndex)
  return col?.label || 'Label'
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
  setChartType(props.sectionIndex, props.chart.columnIndex, type)
}

function handleLabelColumnChange(labelColumnIndex: number) {
  setChartLabelColumn(props.sectionIndex, props.chart.columnIndex, labelColumnIndex)
}

function handleHideChart() {
  toggleSectionChart(props.sectionIndex, props.chart.columnIndex)
}

</script>

<template>
  <div v-if="chart.visible" class="p-4 border rounded-lg bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
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
            <DropdownMenuLabel>Chart type</DropdownMenuLabel>
            <DropdownMenuItem @click="handleTypeChange('bar')">
              <BarChart3 class="w-4 h-4 mr-2" />
              Bar
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleTypeChange('pie')">
              <PieChart class="w-4 h-4 mr-2" />
              Pie
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleTypeChange('line')">
              <LineChart class="w-4 h-4 mr-2" />
              Line
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <!-- Label column selector -->
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag class="w-4 h-4 mr-2" />
                Labels: {{ currentLabelColumn }}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  v-for="col in labelCandidates"
                  :key="col.index"
                  @click="handleLabelColumnChange(col.index)"
                  :class="col.index === chart.labelColumnIndex ? 'bg-accent' : ''"
                >
                  {{ col.label }}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Hide button -->
        <Button variant="ghost" size="sm" @click="handleHideChart" title="Hide chart">
          <EyeOff class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <!-- Bar Chart -->
    <ChartContainer
      v-if="chart.type === 'bar'"
      :config="chartConfig"
      class="h-[150px] w-80"
      :key="'bar-' + sectionIndex + '-' + chart.columnIndex"
    >
      <VisXYContainer :data="chartData">
        <VisGroupedBar
          :x="(d: ChartDataType) => d.index"
          :y="(d: ChartDataType) => d.value"
          :color="chartConfig.value.color"
          :rounded-corners="4"
          :groupMaxWidth="150"
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
      v-else-if="chart.type === 'pie'"
      :config="chartConfig"
      :key="'pie-' + sectionIndex + '-' + chart.columnIndex"
      class="h-[150px] w-80"
    >
      <VisSingleContainer :data="chartData" :width="150" class="flex! items-center gap-4">
        <VisTooltip :triggers="triggers" />
        
        <VisBulletLegend 
        :items="chartData.map(item => ({name: item.name}))"
        orientation="vertical"
        />

        <VisDonut :value="(d: ChartDataType) => d.value" :arc-width="50"/>
      </VisSingleContainer>
    </ChartContainer>

    <!-- Line Chart -->
    <ChartContainer
      v-else-if="chart.type === 'line'"
      :config="chartConfig"
      class="h-[150px] w-80"
      :key="'line-' + sectionIndex + '-' + chart.columnIndex"
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
  </div>
</template>

<style scoped>

</style>