import { describe, it, expect } from 'vitest'
import { Section } from '@/models'
import { CardRecap, Chart } from '@/models'
import type { SectionConfig } from '@/types'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('Section Model', () => {
  const mockConfig: SectionConfig = {
    title: makeCell('Test Section'),
    header: [makeCell('Name'), makeCell('Value')],
    data: [
      [makeCell('Alice'), makeCell(100)],
      [makeCell('Bob'), makeCell(200)],
    ],
  }

  describe('Factory methods', () => {
    it('should create from config', () => {
      const section = Section.fromConfig(mockConfig)
      
      expect(section.title).toEqual({value: 'Test Section'})
      expect(section.header[0]?.value).toEqual('Name')
      expect(section.header[1]?.value).toEqual('Value')
      expect(section.data).toHaveLength(2)
    })

    it('should create new instance', () => {
      const section = Section.create(
        makeCell('My Section'), 
        [makeCell('Col1'), makeCell('Col2')], 
        [[makeCell(1), makeCell(2)]]
      )
      
      expect(section.title?.value).toBe('My Section')
      expect(section.header[0]?.value).toBe('Col1')
      expect(section.header[1]?.value).toBe('Col2')
      expect(section.data).toHaveLength(1)
    })

    it('should create without title', () => {
      const section = Section.create(
        undefined, 
        [makeCell('Col1')], 
        [[makeCell(1)]]
      )
      
      expect(section.title).toBeUndefined()
      expect(section.header[0]?.value).toBe('Col1')
    })
  })

  describe('Immutability', () => {
    it('should create new instance on withTitle', () => {
      const section = Section.fromConfig(mockConfig)
      const updated = section.withTitle(makeCell('New Title'))
      
      expect(section.title?.value).toBe('Test Section')
      expect(updated.title?.value).toBe('New Title')
      expect(section).not.toBe(updated)
    })

    it('should create new instance on withSearchText', () => {
      const section = Section.fromConfig(mockConfig)
      const updated = section.withSearchText('alice')
      
      expect(section.searchText).toBeUndefined()
      expect(updated.searchText).toBe('alice')
      expect(section).not.toBe(updated)
    })
  })

  describe('Search operations', () => {
    it('should set search text', () => {
      const section = Section.fromConfig(mockConfig)
      const updated = section.withSearchText('test')
      
      expect(updated.searchText).toBe('test')
    })

    it('should clear search text', () => {
      const section = Section.fromConfig({
        ...mockConfig,
        searchText: 'test',
      })
      const updated = section.clearSearch()
      
      expect(updated.searchText).toBeUndefined()
    })
  })

  describe('Sort operations', () => {
    it('should set sort config', () => {
      const section = Section.fromConfig(mockConfig)
      const updated = section.withSort(0, 'asc')
      
      expect(updated.sortConfig).toEqual({
        columnIndex: 0,
        direction: 'asc',
      })
    })

    it('should clear sort config', () => {
      const section = Section.fromConfig({
        ...mockConfig,
        sortConfig: { columnIndex: 0, direction: 'asc' },
      })
      const updated = section.clearSort()
      
      expect(updated.sortConfig).toBeUndefined()
    })

    it('should toggle sort: asc -> desc -> clear', () => {
      const section = Section.fromConfig(mockConfig)
      
      // First click: asc
      const step1 = section.toggleSort(0)
      expect(step1.sortConfig?.direction).toBe('asc')
      expect(step1.sortConfig?.columnIndex).toBe(0)
      
      // Second click: desc
      const step2 = step1.toggleSort(0)
      expect(step2.sortConfig?.direction).toBe('desc')
      
      // Third click: clear
      const step3 = step2.toggleSort(0)
      expect(step3.sortConfig).toBeUndefined()
    })

    it('should reset to asc when switching columns', () => {
      const section = Section.fromConfig({
        ...mockConfig,
        sortConfig: { columnIndex: 0, direction: 'desc' },
      })
      
      const updated = section.toggleSort(1)
      expect(updated.sortConfig?.columnIndex).toBe(1)
      expect(updated.sortConfig?.direction).toBe('asc')
    })
  })

  describe('Card recap operations', () => {
    it('should set card recap', () => {
      const section = Section.fromConfig(mockConfig)
      const cardRecap = CardRecap.create(0, 1, makeCell(100), makeCell('Value'))
      const updated = section.setCardRecap(cardRecap)
      
      expect(updated.cardRecap).toBeDefined()
      expect(updated.cardRecap?.value).toEqual({value: 100})
    })

    it('should clear card recap', () => {
      const cardRecap = CardRecap.create(0, 1, makeCell(100), makeCell('Value'))
      const section = Section.fromConfig(mockConfig).setCardRecap(cardRecap)
      const updated = section.clearCardRecap()
      
      expect(updated.cardRecap).toBeUndefined()
    })
  })

  describe('Chart operations', () => {
    it('should add chart', () => {
      const section = Section.fromConfig(mockConfig)
      const updated = section.toggleChart(1)
      
      const charts = updated.getVisibleCharts()
      expect(charts).toHaveLength(1)
      expect(charts[0]!.columnIndex).toBe(1)
    })

    it('should toggle chart visibility', () => {
      const section = Section.fromConfig(mockConfig)
      const withChart = section.toggleChart(1)
      const hidden = withChart.toggleChart(1)
      
      expect(withChart.getVisibleCharts()).toHaveLength(1)
      expect(hidden.getVisibleCharts()).toHaveLength(0)
    })

    it('should get visible charts only', () => {
      const section = Section.fromConfig(mockConfig)
      const withChart1 = section.toggleChart(0)
      const withChart2 = withChart1.toggleChart(1)
      const hideChart1 = withChart2.toggleChart(0)
      
      const visible = hideChart1.getVisibleCharts()
      expect(visible).toHaveLength(1)
      expect(visible[0]!.columnIndex).toBe(1)
    })

    it('should update chart', () => {
      const section = Section.fromConfig(mockConfig)
      const withChart = section.toggleChart(1)
      const updated = withChart.updateChart(1, chart => chart.withType('pie'))
      
      const chart = updated.getChart(1)
      expect(chart?.type).toBe('pie')
    })

    it('should remove chart', () => {
      const section = Section.fromConfig(mockConfig)
      const withChart = section.toggleChart(1)
      const removed = withChart.removeChart(1)
      
      expect(removed.hasChart(1)).toBe(false)
    })

    it('should check if has chart', () => {
      const section = Section.fromConfig(mockConfig)
      const withChart = section.toggleChart(1)
      
      expect(withChart.hasChart(1)).toBe(true)
      expect(withChart.hasChart(0)).toBe(false)
    })

    it('should get chart by column index', () => {
      const section = Section.fromConfig(mockConfig)
      const withChart = section.toggleChart(1)
      
      const chart = withChart.getChart(1)
      expect(chart).toBeDefined()
      expect(chart?.columnIndex).toBe(1)
    })
  })

  describe('Metadata', () => {
    it('should return correct metadata', () => {
      const section = Section.fromConfig({
        ...mockConfig,
        searchText: 'alice',
        sortConfig: { columnIndex: 0, direction: 'asc' },
      })
      
      const metadata = section.getMetadata()
      
      expect(metadata.columnCount).toBe(2)
      expect(metadata.rowCount).toBe(2)
      expect(metadata.hasActiveSearch).toBe(true)
      expect(metadata.hasActiveSort).toBe(true)
      expect(metadata.isEmpty).toBe(false)
    })

    it('should detect empty section', () => {
      const section = Section.fromConfig({
        header: [makeCell('Col1')],
        data: [],
      })
      
      expect(section.getMetadata().isEmpty).toBe(true)
    })

    it('should count charts correctly', () => {
      const section = Section.fromConfig(mockConfig)
      const withCharts = section.toggleChart(0).toggleChart(1)
      const metadata = withCharts.getMetadata()
      
      expect(metadata.chartCount).toBe(2)
      expect(metadata.visibleChartCount).toBe(2)
    })

    it('should detect card recap', () => {
      const cardRecap = CardRecap.create(0, 1, makeCell(100), makeCell('label'))
      const section = Section.fromConfig(mockConfig).setCardRecap(cardRecap)
      
      expect(section.getMetadata().hasCardRecap).toBe(true)
    })
  })

  describe('Column info', () => {
    it('should get column info', () => {
      const section = Section.fromConfig(mockConfig)
      const info = section.getColumnInfo(0)
      
      expect(info.index).toBe(0)
      expect(info.label).toBe('Name')
      expect(info.type).toBe('text')
    })

    it('should get all column info', () => {
      const section = Section.fromConfig(mockConfig)
      const allInfo = section.getAllColumnInfo()
      
      expect(allInfo).toHaveLength(2)
      expect(allInfo[0]!.label).toBe('Name')
      expect(allInfo[1]!.label).toBe('Value')
    })

    it('should detect numeric columns', () => {
      const section = Section.fromConfig(mockConfig)
      const numericCols = section.getNumericColumns()

      console.log(section, mockConfig, numericCols)
      
      expect(numericCols).toHaveLength(1)
      expect(numericCols[0]!.index).toBe(1)
      expect(numericCols[0]!.isNumeric).toBe(true)
    })

    it('should detect text columns', () => {
      const section = Section.fromConfig(mockConfig)
      const textCols = section.getTextColumns()
      
      expect(textCols).toHaveLength(1)
      expect(textCols[0]!.index).toBe(0)
      expect(textCols[0]!.type).toBe('text')
    })

    it('should find label column', () => {
      const section = Section.fromConfig(mockConfig)
      const labelCol = section.findLabelColumn()
      
      expect(labelCol).toBe(0)
    })

    it('should return 0 if no text column found', () => {
      const section = Section.fromConfig({
        header: [makeCell('Val1'), makeCell('Val2')],
        data: [[makeCell(1), makeCell(2)], [makeCell(3), makeCell(4)]],
      })
      
      expect(section.findLabelColumn()).toBe(0)
    })
  })

  describe('Filtered data', () => {
    it('should return all data when no search', () => {
      const section = Section.fromConfig(mockConfig)
      const filtered = section.getFilteredData()
      
      expect(filtered).toEqual(mockConfig.data)
    })

    it('should filter data based on search text', () => {
      const section = Section.fromConfig({
        ...mockConfig,
        searchText: 'alice',
      })
      const filtered = section.getFilteredData()
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0]![0]?.value).toBe('Alice')
    })
  })

  describe('Serialization', () => {
    it('should convert to config', () => {
      const section = Section.fromConfig(mockConfig)
      const config = section.toConfig()
      
      expect(config.title?.value).toBe(mockConfig.title?.value)
      expect(config.header[0]?.value).toBe(mockConfig.header[0]?.value)
      expect(config.data).toEqual(mockConfig.data)
    })

  })
})