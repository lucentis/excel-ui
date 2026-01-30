import { describe, it, expect } from 'vitest'
import { SectionService } from '@/services/SectionService'
import { Section } from '@/models'

describe('SectionService', () => {
  const mockSection = Section.create(
    'Test Section',
    ['Name', 'Value', 'Quantity'],
    [
      ['Product A', 100, 5],
      ['Product B', 200, 10],
    ]
  )

  describe('setCardRecap', () => {
    it('should create card recap for section', () => {
      const updated = SectionService.setCardRecap(mockSection, 0, 1)
      
      expect(updated.cardRecap).toBeDefined()
      expect(updated.cardRecap?.value).toBe(100)
      expect(updated.cardRecap?.label).toBe('Value')
    })

    it('should not mutate original section', () => {
      const updated = SectionService.setCardRecap(mockSection, 0, 1)
      
      expect(mockSection.cardRecap).toBeUndefined()
      expect(updated.cardRecap).toBeDefined()
    })
  })

  describe('toggleChart', () => {
    it('should add chart to section', () => {
      const updated = SectionService.toggleChart(mockSection, 1)
      
      expect(updated.getVisibleCharts()).toHaveLength(1)
      expect(updated.getVisibleCharts()[0]!.columnIndex).toBe(1)
    })

    it('should toggle chart visibility', () => {
      const withChart = SectionService.toggleChart(mockSection, 1)
      const hidden = SectionService.toggleChart(withChart, 1)
      
      expect(withChart.getVisibleCharts()).toHaveLength(1)
      expect(hidden.getVisibleCharts()).toHaveLength(0)
    })
  })

  describe('setChartType', () => {
    it('should change chart type', () => {
      const withChart = SectionService.toggleChart(mockSection, 1)
      const updated = SectionService.setChartType(withChart, 1, 'pie')
      
      const chart = updated.getChart(1)
      expect(chart?.type).toBe('pie')
    })

    it('should not mutate original', () => {
      const withChart = SectionService.toggleChart(mockSection, 1)
      const updated = SectionService.setChartType(withChart, 1, 'pie')
      
      expect(withChart.getChart(1)?.type).toBe('bar')
      expect(updated.getChart(1)?.type).toBe('pie')
    })
  })

  describe('setChartLabelColumn', () => {
    it('should change label column', () => {
      const withChart = SectionService.toggleChart(mockSection, 1)
      const updated = SectionService.setChartLabelColumn(withChart, 1, 2)
      
      const chart = updated.getChart(1)
      expect(chart?.labelColumnIndex).toBe(2)
    })
  })

  describe('toggleRowExclusion', () => {
    it('should exclude row from all visible charts', () => {
      const withChart = SectionService.toggleChart(mockSection, 1)
      const row = ['Product A', 100, 5]
      const updated = SectionService.toggleRowExclusion(withChart, row)
      
      const chart = updated.getChart(1)
      expect(chart?.isRowExcluded(row)).toBe(true)
    })

    it('should toggle exclusion', () => {
      const withChart = SectionService.toggleChart(mockSection, 1)
      const row = ['Product A', 100, 5]
      const excluded = SectionService.toggleRowExclusion(withChart, row)
      const included = SectionService.toggleRowExclusion(excluded, row)
      
      expect(excluded.getChart(1)?.isRowExcluded(row)).toBe(true)
      expect(included.getChart(1)?.isRowExcluded(row)).toBe(false)
    })

    it('should affect all visible charts', () => {
      const withCharts = mockSection
        .toggleChart(1)
        .toggleChart(2)
      
      const row = ['Product A', 100, 5]
      const updated = SectionService.toggleRowExclusion(withCharts, row)
      
      expect(updated.getChart(1)?.isRowExcluded(row)).toBe(true)
      expect(updated.getChart(2)?.isRowExcluded(row)).toBe(true)
    })
  })

  describe('setSearchText', () => {
    it('should set search text', () => {
      const updated = SectionService.setSearchText(mockSection, 'Product A')
      
      expect(updated.searchText).toBe('Product A')
    })

    it('should not mutate original', () => {
      const updated = SectionService.setSearchText(mockSection, 'test')
      
      expect(mockSection.searchText).toBeUndefined()
      expect(updated.searchText).toBe('test')
    })
  })

  describe('clearSearch', () => {
    it('should clear search text', () => {
      const withSearch = mockSection.withSearchText('test')
      const cleared = SectionService.clearSearch(withSearch)
      
      expect(cleared.searchText).toBeUndefined()
    })
  })

  describe('toggleSort', () => {
    it('should set sort on first click', () => {
      const sorted = SectionService.toggleSort(mockSection, 0)
      
      expect(sorted.sortConfig?.columnIndex).toBe(0)
      expect(sorted.sortConfig?.direction).toBe('asc')
    })

    it('should toggle through asc -> desc -> clear', () => {
      const asc = SectionService.toggleSort(mockSection, 0)
      const desc = SectionService.toggleSort(asc, 0)
      const cleared = SectionService.toggleSort(desc, 0)
      
      expect(asc.sortConfig?.direction).toBe('asc')
      expect(desc.sortConfig?.direction).toBe('desc')
      expect(cleared.sortConfig).toBeUndefined()
    })
  })

  describe('clearSort', () => {
    it('should clear sort config', () => {
      const sorted = mockSection.withSort(0, 'asc')
      const cleared = SectionService.clearSort(sorted)
      
      expect(cleared.sortConfig).toBeUndefined()
    })
  })

  describe('setApplyFiltersToCharts', () => {
    it('should set applyFiltersToCharts to true', () => {
      const updated = SectionService.setApplyFiltersToCharts(mockSection, true)
      
      expect(updated.applyFiltersToCharts).toBe(true)
    })

    it('should set applyFiltersToCharts to false', () => {
      const updated = SectionService.setApplyFiltersToCharts(mockSection, false)
      
      expect(updated.applyFiltersToCharts).toBe(false)
    })

    it('should not mutate original', () => {
      const updated = SectionService.setApplyFiltersToCharts(mockSection, false)
      
      expect(mockSection.applyFiltersToCharts).toBe(true) // Default
      expect(updated.applyFiltersToCharts).toBe(false)
    })
  })
})