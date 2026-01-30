import { describe, it, expect } from 'vitest'
import { ChartService } from '@/services/ChartService'
import { Chart } from '@/models'
import type { SectionConfig, ChartConfig } from '@/types'

describe('ChartService', () => {
  const mockSection: SectionConfig = {
    header: ['Name', 'Sales', 'Quantity', 'City'],
    data: [
      ['Product A', 100, 5, 'Paris'],
      ['Product B', 200, 10, 'London'],
      ['Product C', 150, 8, 'Berlin'],
    ],
  }

  describe('isNumericColumn', () => {
    it('should return true for numeric columns', () => {
      expect(ChartService.isNumericColumn(mockSection, 1)).toBe(true) // Sales
      expect(ChartService.isNumericColumn(mockSection, 2)).toBe(true) // Quantity
    })

    it('should return false for non-numeric columns', () => {
      expect(ChartService.isNumericColumn(mockSection, 0)).toBe(false) // Name
      expect(ChartService.isNumericColumn(mockSection, 3)).toBe(false) // City
    })

    it('should return false for empty section', () => {
      const emptySection: SectionConfig = {
        header: ['Col1'],
        data: [],
      }
      expect(ChartService.isNumericColumn(emptySection, 0)).toBe(false)
    })
  })

  describe('findLabelColumn', () => {
    it('should return first text column', () => {
      expect(ChartService.findLabelColumn(mockSection)).toBe(0) // Name
    })

    it('should return 0 if no text column found', () => {
      const numericSection: SectionConfig = {
        header: ['Val1', 'Val2'],
        data: [[1, 2], [3, 4]],
      }
      expect(ChartService.findLabelColumn(numericSection)).toBe(0)
    })
  })

  describe('prepareChartData', () => {
    const chartConfig: ChartConfig = {
      columnIndex: 1, // Sales
      labelColumnIndex: 0, // Name
      type: 'bar',
      excludedRows: [],
      visible: true,
    }

    it('should prepare chart data correctly', () => {
      const chart = Chart.fromConfig(chartConfig)
      const result = ChartService.prepareChartData(mockSection, chart)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ index: 0, name: 'Product A', value: 100 })
      expect(result[1]).toEqual({ index: 1, name: 'Product B', value: 200 })
      expect(result[2]).toEqual({ index: 2, name: 'Product C', value: 150 })
    })

    it('should exclude rows based on excludedRows', () => {
      const rowToExclude = mockSection.data[1]
      const chartWithExclusion: ChartConfig = {
        ...chartConfig,
        excludedRows: [rowToExclude!],
      }
      const chart = Chart.fromConfig(chartWithExclusion)
      const result = ChartService.prepareChartData(mockSection, chart)

      expect(result).toHaveLength(2)
      expect(result[0]!.name).toBe('Product A')
      expect(result[1]!.name).toBe('Product C')
    })

    it('should handle non-numeric values as 0', () => {
      const sectionWithNaN: SectionConfig = {
        header: ['Name', 'Value'],
        data: [['A', 'text'], ['B', null], ['C', 100]],
      }
      const chart = Chart.fromConfig({
        ...chartConfig,
        columnIndex: 1,
      })
      const result = ChartService.prepareChartData(sectionWithNaN, chart)

      expect(result[0]!.value).toBe(0)
      expect(result[1]!.value).toBe(0)
      expect(result[2]!.value).toBe(100)
    })

    it('should apply filters when applyFiltersToCharts is true', () => {
      const sectionWithSearch: SectionConfig = {
        ...mockSection,
        searchText: 'Product A',
        applyFiltersToCharts: true,
      }
      const chart = Chart.fromConfig(chartConfig)
      const result = ChartService.prepareChartData(sectionWithSearch, chart)

      expect(result).toHaveLength(1)
      expect(result[0]!.name).toBe('Product A')
    })

    it('should not apply filters when applyFiltersToCharts is false', () => {
      const sectionWithSearch: SectionConfig = {
        ...mockSection,
        searchText: 'Product A',
        applyFiltersToCharts: false,
      }
      const chart = Chart.fromConfig(chartConfig)
      const result = ChartService.prepareChartData(sectionWithSearch, chart)

      expect(result).toHaveLength(3) // All data, not filtered
    })

    it('should combine filters and exclusions correctly', () => {
      const rowToExclude = mockSection.data[0]
      const sectionWithFilters: SectionConfig = {
        ...mockSection,
        searchText: 'Product',
        applyFiltersToCharts: true,
      }
      const chartWithExclusion = Chart.fromConfig({
        ...chartConfig,
        excludedRows: [rowToExclude!],
      })
      const result = ChartService.prepareChartData(sectionWithFilters, chartWithExclusion)

      // All match search, but Product A is excluded
      expect(result).toHaveLength(2)
      expect(result[0]!.name).toBe('Product B')
      expect(result[1]!.name).toBe('Product C')
    })
  })

  describe('getChartValueLabel', () => {
    it('should return column header', () => {
      const chart = Chart.fromConfig({
        columnIndex: 1,
        labelColumnIndex: 0,
        type: 'bar',
        excludedRows: [],
        visible: true,
      })
      expect(ChartService.getChartValueLabel(mockSection, chart)).toBe('Sales')
    })

    it('should return default label if header missing', () => {
      const sectionNoHeader: SectionConfig = {
        header: [],
        data: [[1, 2]],
      }
      const chart = Chart.fromConfig({
        columnIndex: 0,
        labelColumnIndex: 0,
        type: 'bar',
        excludedRows: [],
        visible: true,
      })
      expect(ChartService.getChartValueLabel(sectionNoHeader, chart)).toBe('Value')
    })
  })

  describe('getLabelCandidateColumns', () => {
    it('should return non-numeric columns', () => {
      const candidates = ChartService.getLabelCandidateColumns(mockSection)
      
      expect(candidates).toHaveLength(2)
      expect(candidates[0]!.index).toBe(0) // Name
      expect(candidates[0]!.label).toBe('Name')
      expect(candidates[1]!.index).toBe(3) // City
      expect(candidates[1]!.label).toBe('City')
    })

    it('should use default label for missing headers', () => {
      const section: SectionConfig = {
        header: [null as any, undefined as any],
        data: [['text1', 'text2']],
      }
      const candidates = ChartService.getLabelCandidateColumns(section)
      
      expect(candidates[0]!.label).toBe('Col 1')
      expect(candidates[1]!.label).toBe('Col 2')
    })
  })

  describe('changeChartType', () => {
    it('should change chart type', () => {
      const chart = Chart.fromConfig({
        columnIndex: 0,
        labelColumnIndex: 0,
        type: 'bar',
        excludedRows: [],
        visible: true,
      })
      const updated = ChartService.changeChartType(chart, 'pie')
      
      expect(updated.type).toBe('pie')
      expect(updated.columnIndex).toBe(0) // Other properties preserved
    })
  })

  describe('changeChartLabelColumn', () => {
    it('should change label column', () => {
      const chart = Chart.fromConfig({
        columnIndex: 1,
        labelColumnIndex: 0,
        type: 'bar',
        excludedRows: [],
        visible: true,
      })
      const updated = ChartService.changeChartLabelColumn(chart, 2)
      
      expect(updated.labelColumnIndex).toBe(2)
      expect(updated.columnIndex).toBe(1) // Other properties preserved
    })
  })

  describe('toggleRowExclusion', () => {
    it('should add row to exclusion list', () => {
      const chart = Chart.fromConfig({
        columnIndex: 0,
        labelColumnIndex: 0,
        type: 'bar',
        excludedRows: [],
        visible: true,
      })
      const row = ['Product A', 100, 5, 'Paris']
      const updated = ChartService.toggleRowExclusion(chart, row)
      
      expect(updated.excludedRows).toContain(row)
    })

    it('should remove row from exclusion list if already excluded', () => {
      const row1 = ['Product A', 100, 5, 'Paris']
      const row2 = ['Product B', 200, 10, 'London']
      const chart = Chart.fromConfig({
        columnIndex: 0,
        labelColumnIndex: 0,
        type: 'bar',
        excludedRows: [row1, row2],
        visible: true,
      })
      const updated = ChartService.toggleRowExclusion(chart, row1)
      
      expect(updated.excludedRows).not.toContain(row1)
      expect(updated.excludedRows).toContain(row2)
    })
  })
})