import { describe, it, expect } from 'vitest'
import { CardRecap } from '@/models'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('CardRecap Model', () => {
  describe('Factory methods', () => {
    it('should create new card recap', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
      
      expect(card.rowIndex).toBe(0)
      expect(card.colIndex).toBe(1)
      expect(card.value).toStrictEqual(makeCell(100))
      expect(card.label).toStrictEqual(makeCell('Sales'))
    })

    it('should create without label', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell(undefined))
      
      expect(card.label.value).toBeUndefined()
    })

    it('should create from config', () => {
      const card = CardRecap.fromConfig({
        rowIndex: 0,
        colIndex: 1,
        value: makeCell(100),
        label: makeCell('Sales'),
      })
      
      expect(card.value).toStrictEqual(makeCell(100))
    })
  })

  describe('Immutability', () => {
    it('should create new instance on withLabel', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell(undefined))
      const updated = card.withLabel(makeCell('New Label'))
      
      expect(card.label.value).toBeUndefined()
      expect(updated.label.value).toBe('New Label')
      expect(card).not.toBe(updated)
    })

    it('should create new instance on withUnit', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
      const updated = card.withUnit('€')
      
      expect(card.unit).toBeUndefined()
      expect(updated.unit).toBe('€')
    })

    it('should create new instance on withColor', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
      const updated = card.withColor('#ff0000')
      
      expect(card.color).toBeUndefined()
      expect(updated.color).toBe('#ff0000')
    })

    it('should create new instance on withIcon', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
      const updated = card.withIcon('💰')
      
      expect(card.icon).toBeUndefined()
      expect(updated.icon).toBe('💰')
    })
  })

  describe('Query methods', () => {
    it('should detect numeric value', () => {
      const numericCard = CardRecap.create(0, 1, makeCell(100), makeCell('Label'))
      const textCard = CardRecap.create(0, 1, makeCell('text'), makeCell('Label'))
      
      expect(numericCard.isNumeric()).toBe(true)
      expect(textCard.isNumeric()).toBe(false)
    })

    it('should detect empty value', () => {
      const emptyCard1 = CardRecap.create(0, 1, makeCell(null), makeCell('Label'))
      const emptyCard2 = CardRecap.create(0, 1, makeCell(undefined), makeCell('Label'))
      const emptyCard3 = CardRecap.create(0, 1, makeCell(''), makeCell('Label'))
      const validCard = CardRecap.create(0, 1, makeCell(100), makeCell('Label'))
      
      expect(emptyCard1.isEmpty()).toBe(true)
      expect(emptyCard2.isEmpty()).toBe(true)
      expect(emptyCard3.isEmpty()).toBe(true)
      expect(validCard.isEmpty()).toBe(false)
    })

    it('should get correct value type', () => {
      expect(CardRecap.create(0, 1, makeCell(100), makeCell('L')).getValueType()).toBe('number')
      expect(CardRecap.create(0, 1, makeCell('text'), makeCell('L')).getValueType()).toBe('text')
      expect(CardRecap.create(0, 1, makeCell(true), makeCell('L')).getValueType()).toBe('boolean')
      expect(CardRecap.create(0, 1, makeCell(new Date()), makeCell('L')).getValueType()).toBe('date')
      expect(CardRecap.create(0, 1, makeCell(null), makeCell('L')).getValueType()).toBe('empty')
    })
  })

  describe('Formatting', () => {
    it('should format empty value as dash', () => {
      const card = CardRecap.create(0, 1, makeCell(null), makeCell('Label'))
      expect(card.formatValue()).toBe('-')
    })

    it('should format number with French locale', () => {
      const card = CardRecap.create(0, 1, makeCell(1234.56), makeCell('Label'))
      const formatted = card.formatValue()
      
      expect(formatted).toContain('1')
      expect(formatted).toContain('234')
    })

    it('should format date', () => {
      const date = new Date('2024-01-15')
      const card = CardRecap.create(0, 1, makeCell(date), makeCell('Label'))
      const formatted = card.formatValue()
      
      expect(formatted).toContain('2024')
      expect(formatted).toContain('01')
      expect(formatted).toContain('15')
    })

    it('should format boolean', () => {
      const trueCard = CardRecap.create(0, 1, makeCell(true), makeCell('Label'))
      const falseCard = CardRecap.create(0, 1, makeCell(false), makeCell('Label'))
      
      expect(trueCard.formatValue()).toBe('Oui')
      expect(falseCard.formatValue()).toBe('Non')
    })

    it('should format string', () => {
      const card = CardRecap.create(0, 1, makeCell('Hello'), makeCell('Label'))
      expect(card.formatValue()).toBe('Hello')
    })
  })

  describe('Serialization', () => {
    it('should convert to config', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
      const config = card.toConfig()
      
      expect(config.rowIndex).toBe(0)
      expect(config.colIndex).toBe(1)
      expect(config.value).toStrictEqual(makeCell(100))
      expect(config.label).toStrictEqual(makeCell('Sales'))
    })

    it('should convert to JSON', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
        .withUnit('€')
        .withColor('#ff0000')
      
      const json = card.toJSON()
      
      expect(json.value).toStrictEqual(makeCell(100))
      expect(json.unit).toBe('€')
      expect(json.color).toBe('#ff0000')
    })

    it('should preserve all properties', () => {
      const card = CardRecap.create(0, 1, makeCell(100), makeCell('Sales'))
        .withUnit('€')
        .withColor('#ff0000')
        .withIcon('💰')
      
      const config = card.toConfig()
      
      expect(config.label).toStrictEqual(makeCell('Sales'))
      expect(config.unit).toBe('€')
      expect(config.color).toBe('#ff0000')
      expect(config.icon).toBe('💰')
    })
  })
})