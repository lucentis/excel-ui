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
import { CellHelper } from './CellHelper'
import type { Cell } from 'exceljs'

/**
 * ChartService
 * Business logic for chart operations
 */
export class ChartService {
  /**
   * Check if a column contains numeric data - REFACTORED with CellHelper
   */
  static isNumericColumn(section: SectionConfig, columnIndex: ColumnIndex): boolean {
    if (section.data.length === 0) return false

    const values = section.data.map(row => row[columnIndex] as Cell)
    
    return values.every(cell => 
      CellHelper.isEmpty(cell) || CellHelper.isNumeric(cell)
    )
  }

  /**
   * Find the first text column for labels - REFACTORED with CellHelper
   * Returns 0 (first column) as default
   */
  static findLabelColumn(section: SectionConfig): ColumnIndex {
    for (let i = 0; i < section.header.length; i++) {
      const values = section.data.map(row => row[i] as Cell)
      
      const isTextColumn = values.every(cell => {
        if (CellHelper.isEmpty(cell)) return true
        const displayValue = CellHelper.getDisplayValue(cell)
        return typeof displayValue === 'string'
      })

      if (isTextColumn) {
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
   * Prepare chart data from section - REFACTORED with CellHelper
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
      .map((row, index): ChartDataPoint => {
        const labelCell = row[chart.labelColumnIndex] as Cell
        const valueCell = row[chart.columnIndex] as Cell
        
        return {
          index,
          name: String(CellHelper.getDisplayValue(labelCell) || ''),
          value: Number(CellHelper.getDisplayValue(valueCell)) || 0,
        }
      })

    // Calculate percentages
    const total = dataPoints.reduce((sum, p) => sum + p.value, 0)
    
    return dataPoints.map(p => ({
      ...p,
      percentage: total > 0 ? (p.value / total) * 100 : 0
    }))
  }

  /**
   * Get the value column label - REFACTORED with CellHelper
   */
  static getChartValueLabel(section: SectionConfig, chart: Chart): string {
    const headerCell = section.header[chart.columnIndex] as Cell
    return String(CellHelper.getDisplayValue(headerCell) || 'Value')
  }

  /**
   * Get the label column name - REFACTORED with CellHelper
   */
  static getChartLabelName(section: SectionConfig, chart: Chart): string {
    const headerCell = section.header[chart.labelColumnIndex] as Cell
    return String(CellHelper.getDisplayValue(headerCell) || 'Label')
  }

  /**
   * Get all non-numeric columns as label candidates - REFACTORED with CellHelper
   */
  static getLabelCandidateColumns(section: SectionConfig): Array<{ index: number; label: string }> {
    return section.header
      .map((header, index) => {
        const headerCell = header as Cell
        return {
          index,
          label: String(CellHelper.getDisplayValue(headerCell) || `Col ${index + 1}`)
        }
      })
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