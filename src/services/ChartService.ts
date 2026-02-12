import { Chart } from '@/models'
import type { 
  ChartType, 
  ChartData,
  ChartDataPoint,
  SectionConfig,
  ColumnIndex,
  RowData,
  DataMatrix,
} from '@/types'
import { FilterService } from './FilterService'

/**
 * ChartService
 * Business logic for chart operations
 */
export class ChartService {
  /**
   * Check if a column contains numeric data
   */
  static isNumericColumn(section: SectionConfig, columnIndex: ColumnIndex): boolean {
    if (section.data.length === 0) return false

    const values = section.data.map(row => row[columnIndex])
    
    const numericCount = values.filter(val => {
      if (typeof val === 'object' && val !== null) {
        const v = val as { value?: unknown; result?: unknown }
        return typeof v.value === 'number' || typeof v.result === 'number'
      }

      return typeof val === 'number'
    }).length

    return values.length === numericCount
  }

  /**
   * Find the first text column for labels
   * Returns 0 (first column) as default
   */
  static findLabelColumn(section: SectionConfig): ColumnIndex {
    for (let i = 0; i < section.header.length; i++) {
      const values = section.data.map(row => row[i])
      const textCount = values.filter(
        val => typeof val === 'string' || val === null || val === undefined
      ).length

      if (textCount === values.length) {
        return i
      }
    }

    return 0
  }

  /**
   * Create a new chart for a section column
   */
  static createChart(section: SectionConfig, columnIndex: ColumnIndex): Chart {
    const labelColumnIndex = this.findLabelColumn(section)
    return Chart.create(columnIndex, labelColumnIndex, 'bar')
  }

  /**
   * Prepare chart data from section
   * Applies filters if configured and calculates percentages
   */
  static prepareChartData(section: SectionConfig, chart: Chart): ChartData {
    let dataSource: DataMatrix
  
    const shouldApplyFilters = section.applyFiltersToCharts !== false
    const hasActiveFilters = FilterService.hasActiveSearch(section) || 
                            FilterService.hasActiveSort(section)
    
    if (shouldApplyFilters && hasActiveFilters) {
      dataSource = FilterService.applyFiltersAndSort(section)
    } else {
      dataSource = section.data
    }
    
    // Filter excluded rows and prepare data points
    const dataPoints = dataSource
      .filter(row => !chart.excludedRows.includes(row))
      .map((row, index): ChartDataPoint => ({
        index,
        name: String(row[chart.labelColumnIndex]?.value || ''),
        value: Number(row[chart.columnIndex]?.value) || 0,
      }))

    // Calculate percentages
    const total = dataPoints.reduce((sum, p) => sum + p.value, 0)
    
    return dataPoints.map(p => ({
      ...p,
      percentage: total > 0 ? (p.value / total) * 100 : 0
    }))
  }

  /**
   * Get the value column label
   */
  static getChartValueLabel(section: SectionConfig, chart: Chart): string {
    return String(section.header[chart.columnIndex]?.value || 'Value')
  }

  /**
   * Get the label column name
   */
  static getChartLabelName(section: SectionConfig, chart: Chart): string {
    return String(section.header[chart.labelColumnIndex] || 'Label')
  }

  /**
   * Get all non-numeric columns as label candidates
   */
  static getLabelCandidateColumns(section: SectionConfig): Array<{ index: number; label: string }> {
    return section.header
      .map((header, index) => ({
        index,
        label: String(header.value || `Col ${index + 1}`)
      }))
      .filter(col => !this.isNumericColumn(section, col.index))
  }

  /**
   * Change chart type
   */
  static changeChartType(chart: Chart, type: ChartType): Chart {
    return chart.withType(type)
  }

  /**
   * Change chart label column
   */
  static changeChartLabelColumn(chart: Chart, labelColumnIndex: ColumnIndex): Chart {
    return chart.withLabelColumn(labelColumnIndex)
  }

  /**
   * Toggle row exclusion in chart
   */
  static toggleRowExclusion(chart: Chart, row: RowData): Chart {
    return chart.toggleRowExclusion(row)
  }
}