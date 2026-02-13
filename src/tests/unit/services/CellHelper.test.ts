import { describe, it, expect } from 'vitest'
import { CellHelper } from '@/services/CellHelper'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('CellHelper', () => {
  describe('getDisplayValue', () => {
    it('should return null for undefined cell', () => {
      expect(CellHelper.getDisplayValue(undefined)).toBe(null)
    })

    it('should return primitive values as-is', () => {
      expect(CellHelper.getDisplayValue(makeCell(42))).toBe(42)
      expect(CellHelper.getDisplayValue(makeCell('hello'))).toBe('hello')
      expect(CellHelper.getDisplayValue(makeCell(true))).toBe(true)
    })

    it('should return formula result', () => {
      const formulaCell = makeCell({ 
        formula: 'SUM(A1:A10)', 
        result: 100 
      })
      expect(CellHelper.getDisplayValue(formulaCell)).toBe(100)
    })

    it('should concatenate rich text', () => {
      const richTextCell = makeCell({
        richText: [
          { text: 'Bold ' },
          { text: 'Text' }
        ]
      })
      expect(CellHelper.getDisplayValue(richTextCell)).toBe('Bold Text')
    })

    it('should return hyperlink text', () => {
      const hyperlinkCell = makeCell({
        text: 'Click here',
        hyperlink: 'https://example.com'
      })
      expect(CellHelper.getDisplayValue(hyperlinkCell)).toBe('Click here')
    })

    it('should return hyperlink URL if no text', () => {
      const hyperlinkCell = makeCell({
        hyperlink: 'https://example.com'
      })
      expect(CellHelper.getDisplayValue(hyperlinkCell)).toBe('https://example.com')
    })

    it('should handle Date objects', () => {
      const date = new Date('2024-01-15')
      expect(CellHelper.getDisplayValue(makeCell(date))).toBe(date)
    })
  })

  describe('getRawValue', () => {
    it('should return null for undefined cell', () => {
      expect(CellHelper.getRawValue(undefined)).toBe(null)
    })

    it('should return cell value structure', () => {
      const formulaValue = { formula: 'SUM(A1:A10)', result: 100 }
      const cell = makeCell(formulaValue)
      expect(CellHelper.getRawValue(cell)).toEqual(formulaValue)
    })

    it('should return primitive values', () => {
      expect(CellHelper.getRawValue(makeCell(42))).toBe(42)
      expect(CellHelper.getRawValue(makeCell('text'))).toBe('text')
    })
  })

  describe('hasFormula', () => {
    it('should return true for formula cells', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      expect(CellHelper.hasFormula(cell)).toBe(true)
    })

    it('should return false for primitive values', () => {
      expect(CellHelper.hasFormula(makeCell(42))).toBe(false)
      expect(CellHelper.hasFormula(makeCell('text'))).toBe(false)
    })

    it('should return false for undefined cell', () => {
      expect(CellHelper.hasFormula(undefined)).toBe(false)
    })
  })

  describe('getFormula', () => {
    it('should return formula string', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      expect(CellHelper.getFormula(cell)).toBe('SUM(A1:A10)')
    })

    it('should return undefined for non-formula cells', () => {
      expect(CellHelper.getFormula(makeCell(42))).toBeUndefined()
    })
  })

  describe('getFormulaResult', () => {
    it('should return formula result', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      expect(CellHelper.getFormulaResult(cell)).toBe(100)
    })

    it('should return undefined for non-formula cells', () => {
      expect(CellHelper.getFormulaResult(makeCell(42))).toBeUndefined()
    })
  })

  describe('hasRichText', () => {
    it('should return true for rich text cells', () => {
      const cell = makeCell({
        richText: [{ text: 'Bold' }]
      })
      expect(CellHelper.hasRichText(cell)).toBe(true)
    })

    it('should return false for primitive values', () => {
      expect(CellHelper.hasRichText(makeCell('text'))).toBe(false)
    })

    it('should return false for undefined cell', () => {
      expect(CellHelper.hasRichText(undefined)).toBe(false)
    })
  })

  describe('getRichText', () => {
    it('should return rich text array', () => {
      const richTextArray = [
        { text: 'Bold ' },
        { text: 'Text' }
      ]
      const cell = makeCell({ richText: richTextArray })
      expect(CellHelper.getRichText(cell)).toEqual(richTextArray)
    })

    it('should return undefined for non-richtext cells', () => {
      expect(CellHelper.getRichText(makeCell('text'))).toBeUndefined()
    })
  })

  describe('hasHyperlink', () => {
    it('should return true for hyperlink cells', () => {
      const cell = makeCell({
        text: 'Click',
        hyperlink: 'https://example.com'
      })
      expect(CellHelper.hasHyperlink(cell)).toBe(true)
    })

    it('should return false for primitive values', () => {
      expect(CellHelper.hasHyperlink(makeCell('text'))).toBe(false)
    })

    it('should return false for undefined cell', () => {
      expect(CellHelper.hasHyperlink(undefined)).toBe(false)
    })
  })

  describe('getHyperlink', () => {
    it('should return hyperlink URL', () => {
      const cell = makeCell({
        text: 'Click',
        hyperlink: 'https://example.com'
      })
      expect(CellHelper.getHyperlink(cell)).toBe('https://example.com')
    })

    it('should return undefined for non-hyperlink cells', () => {
      expect(CellHelper.getHyperlink(makeCell('text'))).toBeUndefined()
    })
  })

  describe('getHyperlinkText', () => {
    it('should return hyperlink display text', () => {
      const cell = makeCell({
        text: 'Click here',
        hyperlink: 'https://example.com'
      })
      expect(CellHelper.getHyperlinkText(cell)).toBe('Click here')
    })

    it('should return undefined for non-hyperlink cells', () => {
      expect(CellHelper.getHyperlinkText(makeCell('text'))).toBeUndefined()
    })
  })

  describe('getCellType', () => {
    it('should detect empty cells', () => {
      expect(CellHelper.getCellType(undefined)).toBe('empty')
      expect(CellHelper.getCellType(makeCell(null))).toBe('empty')
      expect(CellHelper.getCellType(makeCell(undefined))).toBe('empty')
    })

    it('should detect primitive cells', () => {
      expect(CellHelper.getCellType(makeCell(42))).toBe('primitive')
      expect(CellHelper.getCellType(makeCell('text'))).toBe('primitive')
      expect(CellHelper.getCellType(makeCell(true))).toBe('primitive')
    })

    it('should detect formula cells', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      expect(CellHelper.getCellType(cell)).toBe('formula')
    })

    it('should detect rich text cells', () => {
      const cell = makeCell({ richText: [{ text: 'Bold' }] })
      expect(CellHelper.getCellType(cell)).toBe('richText')
    })

    it('should detect hyperlink cells', () => {
      const cell = makeCell({ text: 'Click', hyperlink: 'https://example.com' })
      expect(CellHelper.getCellType(cell)).toBe('hyperlink')
    })
  })

  describe('isEditable', () => {
    it('should return true for primitive cells', () => {
      expect(CellHelper.isEditable(makeCell(42))).toBe(true)
      expect(CellHelper.isEditable(makeCell('text'))).toBe(true)
    })

    it('should return true for formula cells', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      expect(CellHelper.isEditable(cell)).toBe(true)
    })

    it('should return false for rich text cells', () => {
      const cell = makeCell({ richText: [{ text: 'Bold' }] })
      expect(CellHelper.isEditable(cell)).toBe(false)
    })

    it('should return false for hyperlink cells', () => {
      const cell = makeCell({ text: 'Click', hyperlink: 'https://example.com' })
      expect(CellHelper.isEditable(cell)).toBe(false)
    })

    it('should return false for empty cells', () => {
      expect(CellHelper.isEditable(undefined)).toBe(false)
      expect(CellHelper.isEditable(makeCell(null))).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty cells', () => {
      expect(CellHelper.isEmpty(undefined)).toBe(true)
      expect(CellHelper.isEmpty(makeCell(null))).toBe(true)
      expect(CellHelper.isEmpty(makeCell(undefined))).toBe(true)
      expect(CellHelper.isEmpty(makeCell(''))).toBe(true)
    })

    it('should return false for non-empty cells', () => {
      expect(CellHelper.isEmpty(makeCell(0))).toBe(false)
      expect(CellHelper.isEmpty(makeCell(false))).toBe(false)
      expect(CellHelper.isEmpty(makeCell('text'))).toBe(false)
    })
  })

  describe('isNumeric', () => {
    it('should return true for numeric values', () => {
      expect(CellHelper.isNumeric(makeCell(42))).toBe(true)
      expect(CellHelper.isNumeric(makeCell(0))).toBe(true)
      expect(CellHelper.isNumeric(makeCell(-10.5))).toBe(true)
    })

    it('should return true for numeric formula results', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      expect(CellHelper.isNumeric(cell)).toBe(true)
    })

    it('should return false for non-numeric values', () => {
      expect(CellHelper.isNumeric(makeCell('text'))).toBe(false)
      expect(CellHelper.isNumeric(makeCell(true))).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for boolean values', () => {
      expect(CellHelper.isBoolean(makeCell(true))).toBe(true)
      expect(CellHelper.isBoolean(makeCell(false))).toBe(true)
    })

    it('should return false for non-boolean values', () => {
      expect(CellHelper.isBoolean(makeCell(1))).toBe(false)
      expect(CellHelper.isBoolean(makeCell('true'))).toBe(false)
    })
  })

  describe('isDate', () => {
    it('should return true for Date objects', () => {
      const cell = makeCell(new Date('2024-01-15'))
      expect(CellHelper.isDate(cell)).toBe(true)
    })

    it('should return false for non-date values', () => {
      expect(CellHelper.isDate(makeCell('2024-01-15'))).toBe(false)
      expect(CellHelper.isDate(makeCell(42))).toBe(false)
    })
  })

  describe('formatAsString', () => {
    it('should format empty cells as empty string', () => {
      expect(CellHelper.formatAsString(undefined)).toBe('')
      expect(CellHelper.formatAsString(makeCell(null))).toBe('')
    })

    it('should format strings as-is', () => {
      expect(CellHelper.formatAsString(makeCell('hello'))).toBe('hello')
    })

    it('should format numbers with French locale', () => {
      const formatted = CellHelper.formatAsString(makeCell(1234.56))
      expect(formatted).toContain('1')
      expect(formatted).toContain('234')
    })

    it('should format booleans in French', () => {
      expect(CellHelper.formatAsString(makeCell(true))).toBe('Oui')
      expect(CellHelper.formatAsString(makeCell(false))).toBe('Non')
    })

    it('should format dates with French locale', () => {
      const date = new Date('2024-01-15')
      const formatted = CellHelper.formatAsString(makeCell(date))
      expect(formatted).toContain('2024')
      expect(formatted).toContain('01')
      expect(formatted).toContain('15')
    })

    it('should format formula results', () => {
      const cell = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      const formatted = CellHelper.formatAsString(cell)
      expect(formatted).toContain('100')
    })
  })

  describe('equals', () => {
    it('should return true for equal primitive values', () => {
      expect(CellHelper.equals(makeCell(42), makeCell(42))).toBe(true)
      expect(CellHelper.equals(makeCell('text'), makeCell('text'))).toBe(true)
    })

    it('should return false for different values', () => {
      expect(CellHelper.equals(makeCell(42), makeCell(43))).toBe(false)
      expect(CellHelper.equals(makeCell('a'), makeCell('b'))).toBe(false)
    })

    it('should compare formula results', () => {
      const cell1 = makeCell({ formula: 'SUM(A1:A10)', result: 100 })
      const cell2 = makeCell({ formula: 'SUM(B1:B10)', result: 100 })
      expect(CellHelper.equals(cell1, cell2)).toBe(true)
    })

    it('should return true for two undefined cells', () => {
      expect(CellHelper.equals(undefined, undefined)).toBe(true)
    })

    it('should return false when one cell is undefined', () => {
      expect(CellHelper.equals(makeCell(42), undefined)).toBe(false)
      expect(CellHelper.equals(undefined, makeCell(42))).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle cells with zero value', () => {
      expect(CellHelper.isEmpty(makeCell(0))).toBe(false)
      expect(CellHelper.isNumeric(makeCell(0))).toBe(true)
      expect(CellHelper.getDisplayValue(makeCell(0))).toBe(0)
    })

    it('should handle cells with false value', () => {
      expect(CellHelper.isEmpty(makeCell(false))).toBe(false)
      expect(CellHelper.isBoolean(makeCell(false))).toBe(true)
      expect(CellHelper.getDisplayValue(makeCell(false))).toBe(false)
    })

    it('should handle complex formula objects', () => {
      const cell = makeCell({
        formula: 'IF(A1>10, "High", "Low")',
        result: 'High',
        sharedFormula: 'A1'
      })
      expect(CellHelper.hasFormula(cell)).toBe(true)
      expect(CellHelper.getDisplayValue(cell)).toBe('High')
    })

    it('should handle rich text with empty parts', () => {
      const cell = makeCell({
        richText: [
          { text: '' },
          { text: 'Text' }
        ]
      })
      expect(CellHelper.getDisplayValue(cell)).toBe('Text')
    })
  })
})