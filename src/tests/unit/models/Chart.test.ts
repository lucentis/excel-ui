import { describe, it, expect } from 'vitest'
import { Chart } from '@/models'
import type { ChartConfig } from '@/types'

describe('Chart Model', () => {
  const mockConfig: ChartConfig = {
    columnIndex: 1,
    labelColumnIndex: 0,
    type: 'bar',
    excludedRows: [],
    visible: true,
  }

  describe('Factory methods', () => {
    it('should create new chart', () => {
      const chart = Chart.create(1, 0, 'bar')
      
      expect(chart.columnIndex).toBe(1)
      expect(chart.labelColumnIndex).toBe(0)
      expect(chart.type).toBe('bar')
      expect(chart.visible).toBe(true)
      expect(chart.excludedRows).toHaveLength(0)
    })

    it('should create from config', () => {
      const chart = Chart.fromConfig(mockConfig)
      
      expect(chart.columnIndex).toBe(1)
      expect(chart.type).toBe('bar')
    })
  })

  describe('Immutability', () => {
    it('should create new instance on withType', () => {
      const chart = Chart.fromConfig(mockConfig)
      const updated = chart.withType('pie')
      
      expect(chart.type).toBe('bar')
      expect(updated.type).toBe('pie')
      expect(chart).not.toBe(updated)
    })

    it('should preserve other properties when changing type', () => {
      const chart = Chart.fromConfig(mockConfig)
      const updated = chart.withType('line')
      
      expect(updated.columnIndex).toBe(chart.columnIndex)
      expect(updated.labelColumnIndex).toBe(chart.labelColumnIndex)
      expect(updated.excludedRows).toEqual(chart.excludedRows)
    })
  })

  describe('Type operations', () => {
    it('should change type', () => {
      const chart = Chart.fromConfig(mockConfig)
      const updated = chart.withType('pie')
      
      expect(updated.type).toBe('pie')
    })

    it('should support all chart types', () => {
      const chart = Chart.fromConfig(mockConfig)
      
      expect(chart.withType('bar').type).toBe('bar')
      expect(chart.withType('pie').type).toBe('pie')
      expect(chart.withType('line').type).toBe('line')
    })
  })

  describe('Label column operations', () => {
    it('should change label column', () => {
      const chart = Chart.fromConfig(mockConfig)
      const updated = chart.withLabelColumn(2)
      
      expect(updated.labelColumnIndex).toBe(2)
    })
  })

  describe('Visibility operations', () => {
    it('should toggle visibility', () => {
      const chart = Chart.fromConfig(mockConfig)
      const hidden = chart.toggleVisibility()
      
      expect(chart.visible).toBe(true)
      expect(hidden.visible).toBe(false)
    })

    it('should show chart', () => {
      const chart = Chart.fromConfig({ ...mockConfig, visible: false })
      const shown = chart.show()
      
      expect(shown.visible).toBe(true)
    })

    it('should hide chart', () => {
      const chart = Chart.fromConfig(mockConfig)
      const hidden = chart.hide()
      
      expect(hidden.visible).toBe(false)
    })
  })

  describe('Row exclusion operations', () => {
    const row1 = ['Product A', 100]
    const row2 = ['Product B', 200]
    const row3 = ['Product C', 150]

    it('should exclude row', () => {
      const chart = Chart.fromConfig(mockConfig)
      const updated = chart.excludeRow(row1)
      
      expect(updated.excludedRows).toContain(row1)
    })

    it('should not duplicate excluded row', () => {
      const chart = Chart.fromConfig(mockConfig)
      const updated = chart.excludeRow(row1).excludeRow(row1)
      
      expect(updated.excludedRows).toHaveLength(1)
      expect(updated.excludedRows[0]).toBe(row1)
    })

    it('should include row', () => {
      const chart = Chart.fromConfig({
        ...mockConfig,
        excludedRows: [row1, row2],
      })
      const updated = chart.includeRow(row1)
      
      expect(updated.excludedRows).not.toContain(row1)
      expect(updated.excludedRows).toContain(row2)
    })

    it('should toggle row exclusion', () => {
      const chart = Chart.fromConfig(mockConfig)
      
      // Exclude
      const excluded = chart.toggleRowExclusion(row1)
      expect(excluded.isRowExcluded(row1)).toBe(true)
      
      // Include
      const included = excluded.toggleRowExclusion(row1)
      expect(included.isRowExcluded(row1)).toBe(false)
    })

    it('should clear all excluded rows', () => {
      const chart = Chart.fromConfig({
        ...mockConfig,
        excludedRows: [row1, row2, row3],
      })
      const cleared = chart.clearExcludedRows()
      
      expect(cleared.excludedRows).toHaveLength(0)
    })
  })

  describe('Query methods', () => {
    const row1 = ['Product A', 100]
    const row2 = ['Product B', 200]
    const row3 = ['Product C', 150]

    it('should check if row is excluded', () => {
      const chart = Chart.fromConfig({
        ...mockConfig,
        excludedRows: [row1, row3],
      })
      
      expect(chart.isRowExcluded(row1)).toBe(true)
      expect(chart.isRowExcluded(row2)).toBe(false)
      expect(chart.isRowExcluded(row3)).toBe(true)
    })

    it('should check if has excluded rows', () => {
      const noExclusions = Chart.fromConfig(mockConfig)
      const withExclusions = Chart.fromConfig({
        ...mockConfig,
        excludedRows: [row1],
      })
      
      expect(noExclusions.hasExcludedRows()).toBe(false)
      expect(withExclusions.hasExcludedRows()).toBe(true)
    })

    it('should get excluded row count', () => {
      const chart = Chart.fromConfig({
        ...mockConfig,
        excludedRows: [row1, row2, row3],
      })
      
      expect(chart.getExcludedRowCount()).toBe(3)
    })
  })

  describe('Serialization', () => {
    const row1 = ['Product A', 100]

    it('should convert to config', () => {
      const chart = Chart.fromConfig(mockConfig)
      const config = chart.toConfig()
      
      expect(config).toEqual(mockConfig)
    })

    it('should convert to JSON', () => {
      const chart = Chart.fromConfig(mockConfig)
      const json = chart.toJSON()
      
      expect(json).toEqual(mockConfig)
    })

    it('should preserve excluded rows in serialization', () => {
      const chart = Chart.fromConfig({
        ...mockConfig,
        excludedRows: [row1],
      })
      const config = chart.toConfig()
      
      expect(config.excludedRows).toHaveLength(1)
      expect(config.excludedRows[0]).toBe(row1)
    })
  })
})