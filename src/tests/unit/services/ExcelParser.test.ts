import { describe, it, expect, vi } from 'vitest'
import { ExcelParser } from '@/services/ExcelParser'

describe('ExcelParser', () => {
  describe('isEmptyRow', () => {
    it('should return true for completely empty row', () => {
      expect(ExcelParser.isEmptyRow([])).toBe(true)
      expect(ExcelParser.isEmptyRow([null, null, null])).toBe(true)
      expect(ExcelParser.isEmptyRow([undefined, undefined])).toBe(true)
      expect(ExcelParser.isEmptyRow(['', '', ''])).toBe(true)
    })

    it('should return false for row with any value', () => {
      expect(ExcelParser.isEmptyRow(['text', null])).toBe(false)
      expect(ExcelParser.isEmptyRow([0])).toBe(false)
      expect(ExcelParser.isEmptyRow([null, 123])).toBe(false)
      expect(ExcelParser.isEmptyRow([false])).toBe(false)
    })

    it('should handle mixed empty values', () => {
      expect(ExcelParser.isEmptyRow([null, '', undefined])).toBe(true)
      expect(ExcelParser.isEmptyRow([null, '', 'value'])).toBe(false)
    })
  })

  describe('countFilledCells', () => {
    it('should count non-empty cells', () => {
      expect(ExcelParser.countFilledCells(['a', 'b', 'c'])).toBe(3)
      expect(ExcelParser.countFilledCells(['a', null, 'c'])).toBe(2)
      expect(ExcelParser.countFilledCells([1, 2, 3, 4])).toBe(4)
    })

    it('should ignore empty values', () => {
      expect(ExcelParser.countFilledCells([null, null, null])).toBe(0)
      expect(ExcelParser.countFilledCells(['', '', ''])).toBe(0)
      expect(ExcelParser.countFilledCells([undefined, undefined])).toBe(0)
    })

    it('should handle mixed types', () => {
      expect(ExcelParser.countFilledCells([0, false, '', null])).toBe(2) // 0 and false count
      expect(ExcelParser.countFilledCells(['text', 123, true, null])).toBe(3)
    })

    it('should return 0 for undefined row', () => {
      expect(ExcelParser.countFilledCells(undefined)).toBe(0)
    })

    it('should return 0 for empty array', () => {
      expect(ExcelParser.countFilledCells([])).toBe(0)
    })
  })

  describe('extractRawData', () => {
    it('should extract simple values from worksheet', () => {
      // Mock worksheet
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          // Simulate 3 rows
          const rows = [
            createMockRow(['Title']),
            createMockRow(['Name', 'Age']),
            createMockRow(['Alice', 30]),
          ]
          rows.forEach(row => callback(row))
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual(['Title'])
      expect(result[1]).toEqual(['Name', 'Age'])
      expect(result[2]).toEqual(['Alice', 30])
    })

    it('should handle formulas by extracting result', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const row = createMockRow([
            'Text',
            { result: 100, formula: 'SUM(A1:A10)' }, // Formula
          ])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![1]).toBe(100) // Should extract result, not formula
    })

    it('should handle rich text by extracting plain text', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const row = createMockRow([
            'Normal',
            { 
              richText: [
                { text: 'Bold ' },
                { text: 'Text' }
              ]
            },
          ])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![1]).toBe('Bold Text')
    })

    it('should handle hyperlinks by extracting text', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const row = createMockRow([
            'Normal',
            { text: 'Click here', hyperlink: 'https://example.com' },
          ])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![1]).toBe('Click here')
    })

    it('should handle empty cells', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const row = createMockRow(['A', null, 'C', undefined])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]).toEqual(['A', null, 'C', undefined])
    })

    it('should preserve different data types', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const date = new Date('2024-01-15')
          const row = createMockRow(['Text', 123, true, date, null])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![0]).toBe('Text')
      expect(result[0]![1]).toBe(123)
      expect(result[0]![2]).toBe(true)
      expect(result[0]![3]).toBeInstanceOf(Date)
      expect(result[0]![4]).toBe(null)
    })
  })
})

/**
 * Helper to create mock ExcelJS row
 */
function createMockRow(cellValues: any[]) {
  const cells: any[] = []
  
  cellValues.forEach((value, index) => {
    cells.push({
      value,
      col: index + 1,
      row: 1,
    })
  })

  return {
    values: cellValues,
    eachCell: (options: any, callback: Function) => {
      cells.forEach(cell => callback(cell))
    }
  }
}