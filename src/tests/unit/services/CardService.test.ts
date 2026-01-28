import { describe, it, expect } from 'vitest'
import { CardService } from '@/services/CardService'
import type { SectionConfig } from '@/types'

describe('CardService', () => {
  const mockSection: SectionConfig = {
    header: ['Name', 'Sales', 'Quantity'],
    data: [
      ['Product A', 100, 5],
      ['Product B', 200, 10],
      ['Product C', 150, 8],
    ],
  }

  describe('createCardRecap', () => {
    it('should create card recap from data cell', () => {
      const card = CardService.createCardRecap(mockSection, 0, 1)
      
      expect(card.rowIndex).toBe(0)
      expect(card.colIndex).toBe(1)
      expect(card.value).toBe(100)
      expect(card.label).toBe('Sales')
    })

    it('should create card recap from header when no data', () => {
      const sectionNoData: SectionConfig = {
        header: ['Total', 'Amount'],
        data: [],
      }
      
      const card = CardService.createCardRecap(sectionNoData, 0, 1)
      
      expect(card.value).toBe('Amount')
      expect(card.label).toBe('Total')
    })

    it('should handle different column indices', () => {
      const card0 = CardService.createCardRecap(mockSection, 1, 0)
      const card1 = CardService.createCardRecap(mockSection, 1, 1)
      const card2 = CardService.createCardRecap(mockSection, 1, 2)
      
      expect(card0.value).toBe('Product B')
      expect(card1.value).toBe(200)
      expect(card2.value).toBe(10)
    })
  })

  describe('formatCardValue', () => {
    it('should format null as dash', () => {
      expect(CardService.formatCardValue(null)).toBe('-')
      expect(CardService.formatCardValue(undefined)).toBe('-')
    })

    it('should format numbers with French locale', () => {
      const formatted = CardService.formatCardValue(1234.56)
      expect(formatted).toContain('1')
      expect(formatted).toContain('234')
    })

    it('should format dates', () => {
      const date = new Date('2024-01-15')
      const formatted = CardService.formatCardValue(date)
      
      expect(formatted).toContain('2024')
      expect(formatted).toContain('01')
      expect(formatted).toContain('15')
    })

    it('should format booleans', () => {
      expect(CardService.formatCardValue(true)).toBe('Yes')
      expect(CardService.formatCardValue(false)).toBe('No')
    })

    it('should convert other types to string', () => {
      expect(CardService.formatCardValue('Hello')).toBe('Hello')
      expect(CardService.formatCardValue(123)).toContain('123')
    })
  })

  describe('isNumericValue', () => {
    it('should return true for numbers', () => {
      expect(CardService.isNumericValue(123)).toBe(true)
      expect(CardService.isNumericValue(0)).toBe(true)
      expect(CardService.isNumericValue(-45.67)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(CardService.isNumericValue('123')).toBe(false)
      expect(CardService.isNumericValue(null)).toBe(false)
      expect(CardService.isNumericValue(undefined)).toBe(false)
      expect(CardService.isNumericValue(true)).toBe(false)
    })
  })

  describe('getValueType', () => {
    it('should identify empty values', () => {
      expect(CardService.getValueType(null)).toBe('empty')
      expect(CardService.getValueType(undefined)).toBe('empty')
      expect(CardService.getValueType('')).toBe('empty')
    })

    it('should identify numbers', () => {
      expect(CardService.getValueType(123)).toBe('number')
      expect(CardService.getValueType(0)).toBe('number')
      expect(CardService.getValueType(-45.67)).toBe('number')
    })

    it('should identify booleans', () => {
      expect(CardService.getValueType(true)).toBe('boolean')
      expect(CardService.getValueType(false)).toBe('boolean')
    })

    it('should identify dates', () => {
      expect(CardService.getValueType(new Date())).toBe('date')
    })

    it('should identify text', () => {
      expect(CardService.getValueType('hello')).toBe('text')
      expect(CardService.getValueType('123')).toBe('text')
    })
  })
})