import { describe, it, expect } from 'vitest'
import { ExcelParser } from '@/services/ExcelParser'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('ExcelParser', () => {
  describe('isEmptyRow', () => {
    it('should return true for completely empty row', () => {
      expect(ExcelParser.isEmptyRow([])).toBe(true)
      expect(ExcelParser.isEmptyRow([makeCell(null), makeCell(null), makeCell(null)])).toBe(true)
      expect(ExcelParser.isEmptyRow([makeCell(undefined), makeCell(undefined)])).toBe(true)
      expect(ExcelParser.isEmptyRow([makeCell(''), makeCell(''), makeCell('')])).toBe(true)
    })

    it('should return false for row with any value', () => {
      expect(ExcelParser.isEmptyRow([makeCell('text'), makeCell(null)])).toBe(false)
      expect(ExcelParser.isEmptyRow([makeCell(0)])).toBe(false)
      expect(ExcelParser.isEmptyRow([makeCell(null), makeCell(123)])).toBe(false)
      expect(ExcelParser.isEmptyRow([makeCell(false)])).toBe(false)
    })

    it('should handle mixed empty values', () => {
      expect(ExcelParser.isEmptyRow([makeCell(null), makeCell(''), makeCell(undefined)])).toBe(true)
      expect(ExcelParser.isEmptyRow([makeCell(null), makeCell(''), makeCell('value')])).toBe(false)
    })
  })

  describe('countFilledCells', () => {
    it('should count non-empty cells', () => {
      expect(ExcelParser.countFilledCells([makeCell('a'), makeCell('b'), makeCell('c')])).toBe(3)
      expect(ExcelParser.countFilledCells([makeCell('a'), makeCell(null), makeCell('c')])).toBe(2)
      expect(ExcelParser.countFilledCells([makeCell(1), makeCell(2), makeCell(3), makeCell(4)])).toBe(4)
    })

    it('should ignore empty values', () => {
      expect(ExcelParser.countFilledCells([makeCell(null), makeCell(null), makeCell(null)])).toBe(0)
      expect(ExcelParser.countFilledCells([makeCell(''), makeCell(''), makeCell('')])).toBe(0)
      expect(ExcelParser.countFilledCells([makeCell(undefined), makeCell(undefined)])).toBe(0)
    })

    it('should handle mixed types', () => {
      expect(ExcelParser.countFilledCells([makeCell(0), makeCell(false), makeCell(''), makeCell(null)])).toBe(2) // 0 and false count
      expect(ExcelParser.countFilledCells([makeCell('text'), makeCell(123), makeCell(true), makeCell(null)])).toBe(3)
    })

    it('should return 0 for undefined row', () => {
      expect(ExcelParser.countFilledCells(undefined)).toBe(0)
    })

    it('should return 0 for empty array', () => {
      expect(ExcelParser.countFilledCells([])).toBe(0)
    })
  })

  describe('extractRawData', () => {
    it('should extract Cell objects from worksheet', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
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
      expect(result[0]![0]).toHaveProperty('value', 'Title')
      expect(result[1]![0]).toHaveProperty('value', 'Name')
      expect(result[1]![1]).toHaveProperty('value', 'Age')
      expect(result[2]![0]).toHaveProperty('value', 'Alice')
      expect(result[2]![1]).toHaveProperty('value', 30)
    })

    it('should handle formulas by keeping Cell object', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const row = createMockRow([
            'Text',
            { result: 100, formula: 'SUM(A1:A10)' },
          ])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![1]).toHaveProperty('value')
      expect((result[0]![1] as any).value).toHaveProperty('result', 100)
      expect((result[0]![1] as any).value).toHaveProperty('formula', 'SUM(A1:A10)')
    })

    it('should handle rich text by keeping Cell object', () => {
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

      expect(result[0]![1]).toHaveProperty('value')
      expect((result[0]![1] as any).value).toHaveProperty('richText')
    })

    it('should handle hyperlinks by keeping Cell object', () => {
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

      expect(result[0]![1]).toHaveProperty('value')
      expect((result[0]![1] as any).value).toHaveProperty('text', 'Click here')
      expect((result[0]![1] as any).value).toHaveProperty('hyperlink')
    })

    it('should handle empty cells', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const row = createMockRow(['A', null, 'C', undefined])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![0]).toHaveProperty('value', 'A')
      expect(result[0]![1]).toHaveProperty('value', null)
      expect(result[0]![2]).toHaveProperty('value', 'C')
      expect(result[0]![3]).toHaveProperty('value', undefined)
    })

    it('should preserve different data types in Cell objects', () => {
      const mockWorksheet: any = {
        eachRow: (options: any, callback: Function) => {
          const date = new Date('2024-01-15')
          const row = createMockRow(['Text', 123, true, date, null])
          callback(row)
        }
      }

      const result = ExcelParser.extractRawData(mockWorksheet)

      expect(result[0]![0]).toHaveProperty('value', 'Text')
      expect(result[0]![1]).toHaveProperty('value', 123)
      expect(result[0]![2]).toHaveProperty('value', true)
      expect((result[0]![3] as any).value).toBeInstanceOf(Date)
      expect(result[0]![4]).toHaveProperty('value', null)
    })
  })
})

/**
 * Helper to create mock ExcelJS Cell
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