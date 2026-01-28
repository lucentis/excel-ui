import { describe, it, expect } from 'vitest'
import { CardRecap } from '@/models'

describe('CardRecap Model', () => {
  describe('Factory methods', () => {
    it('should create new card recap', () => {
      const card = CardRecap.create(0, 1, 100, 'Sales')
      
      expect(card.rowIndex).toBe(0)
      expect(card.colIndex).toBe(1)
      expect(card.value).toBe(100)
      expect(card.label).toBe('Sales')
    })

    it('should create without label', () => {
      const card = CardRecap.create(0, 1, 100)
      
      expect(card.label).toBeUndefined()
    })

    it('should create from config', () => {
      const card = CardRecap.fromConfig({
        rowIndex: 0,
        colIndex: 1,
        value: 100,
        label: 'Sales',
      })
      
      expect(card.value).toBe(100)
    })
  })

  describe('Immutability', () => {
    it('should create new instance on withLabel', () => {
      const card = CardRecap.create(0, 1, 100)
      const updated = card.withLabel('New Label')
      
      expect(card.label).toBeUndefined()
      expect(updated.label).toBe('New Label')
      expect(card).not.toBe(updated)
    })

    it('should create new instance on withUnit', () => {
      const card = CardRecap.create(0, 1, 100)
      const updated = card.withUnit('€')
      
      expect(card.unit).toBeUndefined()
      expect(updated.unit).toBe('€')
    })

    it('should create new instance on withColor', () => {
      const card = CardRecap.create(0, 1, 100)
      const updated = card.withColor('#ff0000')
      
      expect(card.color).toBeUndefined()
      expect(updated.color).toBe('#ff0000')
    })

    it('should create new instance on withIcon', () => {
      const card = CardRecap.create(0, 1, 100)
      const updated = card.withIcon('💰')
      
      expect(card.icon).toBeUndefined()
      expect(updated.icon).toBe('💰')
    })
  })

  describe('Query methods', () => {
    it('should detect numeric value', () => {
      const numericCard = CardRecap.create(0, 1, 100)
      const textCard = CardRecap.create(0, 1, 'text')
      
      expect(numericCard.isNumeric()).toBe(true)
      expect(textCard.isNumeric()).toBe(false)
    })

    it('should detect empty value', () => {
      const emptyCard1 = CardRecap.create(0, 1, null as any)
      const emptyCard2 = CardRecap.create(0, 1, undefined as any)
      const emptyCard3 = CardRecap.create(0, 1, '')
      const validCard = CardRecap.create(0, 1, 100)
      
      expect(emptyCard1.isEmpty()).toBe(true)
      expect(emptyCard2.isEmpty()).toBe(true)
      expect(emptyCard3.isEmpty()).toBe(true)
      expect(validCard.isEmpty()).toBe(false)
    })

    it('should get correct value type', () => {
      expect(CardRecap.create(0, 1, 100).getValueType()).toBe('number')
      expect(CardRecap.create(0, 1, 'text').getValueType()).toBe('text')
      expect(CardRecap.create(0, 1, true).getValueType()).toBe('boolean')
      expect(CardRecap.create(0, 1, new Date()).getValueType()).toBe('date')
      expect(CardRecap.create(0, 1, null as any).getValueType()).toBe('empty')
    })
  })

  describe('Formatting', () => {
    it('should format empty value as dash', () => {
      const card = CardRecap.create(0, 1, null as any)
      expect(card.formatValue()).toBe('-')
    })

    it('should format number with French locale', () => {
      const card = CardRecap.create(0, 1, 1234.56)
      const formatted = card.formatValue()
      
      expect(formatted).toContain('1')
      expect(formatted).toContain('234')
    })

    it('should format date', () => {
      const date = new Date('2024-01-15')
      const card = CardRecap.create(0, 1, date)
      const formatted = card.formatValue()
      
      expect(formatted).toContain('2024')
      expect(formatted).toContain('01')
      expect(formatted).toContain('15')
    })

    it('should format boolean', () => {
      const trueCard = CardRecap.create(0, 1, true)
      const falseCard = CardRecap.create(0, 1, false)
      
      expect(trueCard.formatValue()).toBe('Oui')
      expect(falseCard.formatValue()).toBe('Non')
    })

    it('should format string', () => {
      const card = CardRecap.create(0, 1, 'Hello')
      expect(card.formatValue()).toBe('Hello')
    })
  })

  describe('Serialization', () => {
    it('should convert to config', () => {
      const card = CardRecap.create(0, 1, 100, 'Sales')
      const config = card.toConfig()
      
      expect(config.rowIndex).toBe(0)
      expect(config.colIndex).toBe(1)
      expect(config.value).toBe(100)
      expect(config.label).toBe('Sales')
    })

    it('should convert to JSON', () => {
      const card = CardRecap.create(0, 1, 100, 'Sales')
        .withUnit('€')
        .withColor('#ff0000')
      
      const json = card.toJSON()
      
      expect(json.value).toBe(100)
      expect(json.unit).toBe('€')
      expect(json.color).toBe('#ff0000')
    })

    it('should preserve all properties', () => {
      const card = CardRecap.create(0, 1, 100, 'Sales')
        .withUnit('€')
        .withColor('#ff0000')
        .withIcon('💰')
      
      const config = card.toConfig()
      
      expect(config.label).toBe('Sales')
      expect(config.unit).toBe('€')
      expect(config.color).toBe('#ff0000')
      expect(config.icon).toBe('💰')
    })
  })
})