import { describe, it, expect } from 'vitest'
import { CardService } from '@/services/CardService'
import { CellHelper } from '@/services/CellHelper'
import type { SectionConfig, CardStyleConfig } from '@/types'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('CardService', () => {
  const mockSection: SectionConfig = {
    header: [makeCell('Name'), makeCell('Sales'), makeCell('Quantity')],
    data: [
      [makeCell('Product A'), makeCell(100), makeCell(5)],
      [makeCell('Product B'), makeCell(200), makeCell(10)],
      [makeCell('Product C'), makeCell(150), makeCell(8)],
    ],
  }

  describe('createCardRecap', () => {
    it('should create card recap from data cell', () => {
      const card = CardService.createCardRecap(mockSection, 0, 1)
      
      expect(card.rowIndex).toBe(0)
      expect(card.colIndex).toBe(1)
      expect(card.value).toStrictEqual({value: 100})
      expect(card.label).toStrictEqual({value: 'Sales'})
    })

    it('should create card recap from header when no data', () => {
      const sectionNoData: SectionConfig = {
        header: [makeCell('Total'), makeCell('Amount')],
        data: [],
      }
      
      const card = CardService.createCardRecap(sectionNoData, 0, 1)
      
      expect(card.value).toStrictEqual({value: 'Amount'})
      expect(card.label).toStrictEqual({value: 'Total'})
    })

    it('should handle different column indices', () => {
      const card0 = CardService.createCardRecap(mockSection, 1, 0)
      const card1 = CardService.createCardRecap(mockSection, 1, 1)
      const card2 = CardService.createCardRecap(mockSection, 1, 2)
      
      expect(card0.value).toStrictEqual({
        value: "Product B",
      })
      expect(card1.value).toStrictEqual({value: 200})
      expect(card2.value).toStrictEqual({value: 10})
    })
  })

  describe('updateCardStyle', () => {
    it('should update card style', () => {
      const card = CardService.createCardRecap(mockSection, 0, 1)
      const updated = CardService.updateCardStyle(card, {
        valueFormat: { type: 'percentage' }
      })
      
      expect(updated.style.valueFormat.type).toBe('percentage')
    })
  })

  describe('setCardStyle', () => {
    it('should set full card style', () => {
      const card = CardService.createCardRecap(mockSection, 0, 1)
      const newStyle: CardStyleConfig = {
        valueFormat: { type: 'currency', customUnit: '$' },
        size: 'large',
        colorTheme: 'blue',
        iconPosition: 'left',
        typography: {
          titleSize: 'medium',
          valueSize: 'large'
        }
      }
      const updated = CardService.setCardStyle(card, newStyle)
      
      expect(updated.style).toEqual(newStyle)
    })
  })
})

// Test CellHelper separately (moved from CardService)
describe('CellHelper (formerly CardService helpers)', () => {
  describe('formatAsString', () => {
    it('should format null as empty string', () => {
      expect(CellHelper.formatAsString(makeCell(null))).toBe('')
      expect(CellHelper.formatAsString(makeCell(undefined))).toBe('')
    })

    it('should format numbers with French locale', () => {
      const formatted = CellHelper.formatAsString(makeCell(1234.56))
      expect(formatted).toContain('1')
      expect(formatted).toContain('234')
    })

    it('should format dates', () => {
      const date = new Date('2024-01-15')
      const formatted = CellHelper.formatAsString(makeCell(date))
      
      expect(formatted).toContain('2024')
      expect(formatted).toContain('01')
      expect(formatted).toContain('15')
    })

    it('should format booleans', () => {
      expect(CellHelper.formatAsString(makeCell(true))).toBe('Oui')
      expect(CellHelper.formatAsString(makeCell(false))).toBe('Non')
    })

    it('should convert other types to string', () => {
      expect(CellHelper.formatAsString(makeCell('Hello'))).toBe('Hello')
      const formatted = CellHelper.formatAsString(makeCell(123))
      expect(formatted).toContain('123')
    })
  })

  describe('isNumeric', () => {
    it('should return true for numbers', () => {
      expect(CellHelper.isNumeric(makeCell(123))).toBe(true)
      expect(CellHelper.isNumeric(makeCell(0))).toBe(true)
      expect(CellHelper.isNumeric(makeCell(-45.67))).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(CellHelper.isNumeric(makeCell('123'))).toBe(false)
      expect(CellHelper.isNumeric(makeCell(null))).toBe(false)
      expect(CellHelper.isNumeric(makeCell(undefined))).toBe(false)
      expect(CellHelper.isNumeric(makeCell(true))).toBe(false)
    })
  })

  describe('getValueType via isEmpty/isNumeric/isBoolean/isDate', () => {
    it('should identify empty values', () => {
      expect(CellHelper.isEmpty(makeCell(null))).toBe(true)
      expect(CellHelper.isEmpty(makeCell(undefined))).toBe(true)
      expect(CellHelper.isEmpty(makeCell(''))).toBe(true)
    })

    it('should identify numbers', () => {
      expect(CellHelper.isNumeric(makeCell(123))).toBe(true)
      expect(CellHelper.isNumeric(makeCell(0))).toBe(true)
      expect(CellHelper.isNumeric(makeCell(-45.67))).toBe(true)
    })

    it('should identify booleans', () => {
      expect(CellHelper.isBoolean(makeCell(true))).toBe(true)
      expect(CellHelper.isBoolean(makeCell(false))).toBe(true)
    })

    it('should identify dates', () => {
      expect(CellHelper.isDate(makeCell(new Date()))).toBe(true)
    })

    it('should identify text by exclusion', () => {
      const textCell = makeCell('hello')
      expect(CellHelper.isEmpty(textCell)).toBe(false)
      expect(CellHelper.isNumeric(textCell)).toBe(false)
      expect(CellHelper.isBoolean(textCell)).toBe(false)
      expect(CellHelper.isDate(textCell)).toBe(false)
      // If none of the above, it's text
    })
  })
})