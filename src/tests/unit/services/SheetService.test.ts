import { describe, it, expect } from 'vitest'
import { SheetService } from '@/services/SheetService'
import { Sheet, Section } from '@/models'
import type { DataMatrix } from '@/types'

describe('SheetService', () => {
  const mockData: DataMatrix = [
    ['Document Title'],
    [],
    ['Section 1'],
    ['Name', 'Value'],
    ['Alice', 100],
  ]

  const mockSections = [
    Section.create('Section 1', ['Name', 'Value'], [['Alice', 100]])
  ]

  describe('buildSheet', () => {
    it('should build sheet from worksheet', () => {
      // Mock worksheet
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          mockData.forEach((row, index) => {
            callback(createMockRow(row, index + 1))
          })
        }
      }

      const sheet = SheetService.buildSheet('Sheet1', mockWorksheet)

      expect(sheet.name).toBe('Sheet1')
      expect(sheet.title).toBe('Document Title')
      expect(sheet.sections).toHaveLength(1)
    })
  })

  describe('updateSection', () => {
    it('should update a section', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      
      const updated = SheetService.updateSection(sheet, 0, section =>
        section.withTitle('New Title')
      )

      expect(updated.getSection(0)?.title).toBe('New Title')
    })

    it('should not mutate original sheet', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      
      const updated = SheetService.updateSection(sheet, 0, section =>
        section.withSearchText('test')
      )

      expect(sheet.getSection(0)?.searchText).toBeUndefined()
      expect(updated.getSection(0)?.searchText).toBe('test')
    })

    it('should handle updater function correctly', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      
      const updated = SheetService.updateSection(sheet, 0, section =>
        section.withSearchText('test').withSort(0, 'asc')
      )

      const updatedSection = updated.getSection(0)
      expect(updatedSection?.searchText).toBe('test')
      expect(updatedSection?.sortConfig?.direction).toBe('asc')
    })
  })

  describe('getSection', () => {
    it('should get section by index', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const section = SheetService.getSection(sheet, 0)
      
      expect(section).toBeDefined()
      expect(section?.title).toBe('Section 1')
    })

    it('should return undefined for invalid index', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const section = SheetService.getSection(sheet, 999)
      
      expect(section).toBeUndefined()
    })
  })

  describe('Integration scenarios', () => {
    it('should handle multiple section updates', () => {
      const sections = [
        Section.create('Section 1', ['A'], [['1']]),
        Section.create('Section 2', ['B'], [['2']]),
      ]

      const sheet = Sheet.create('Test', null, [[]], '', sections)
      
      const updated = SheetService.updateSection(
        SheetService.updateSection(sheet, 0, s => s.withSearchText('test1')),
        1,
        s => s.withSearchText('test2')
      )

      expect(updated.getSection(0)?.searchText).toBe('test1')
      expect(updated.getSection(1)?.searchText).toBe('test2')
    })

    it('should preserve other sections when updating one', () => {
      const sections = [
        Section.create('Section 1', ['A'], [['1']]),
        Section.create('Section 2', ['B'], [['2']]),
      ]

      const sheet = Sheet.create('Test', null, [[]], '', sections)
      
      const updated = SheetService.updateSection(sheet, 0, s =>
        s.withTitle('Updated')
      )

      expect(updated.getSection(0)?.title).toBe('Updated')
      expect(updated.getSection(1)?.title).toBe('Section 2')
    })
  })
})

/**
 * Helper to create mock ExcelJS row
 */
function createMockRow(cellValues: any[], rowNumber: number) {
  const cells: any[] = []
  
  cellValues.forEach((value, index) => {
    cells.push({
      value,
      col: index + 1,
      row: rowNumber,
    })
  })

  return {
    values: cellValues,
    eachCell: (options: any, callback: Function) => {
      cells.forEach(cell => callback(cell))
    }
  }
}