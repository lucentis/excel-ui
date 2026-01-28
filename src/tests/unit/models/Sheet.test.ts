import { describe, it, expect } from 'vitest'
import { Sheet, Section } from '@/models'
import type { SheetConfig, DataMatrix } from '@/types'

describe('Sheet Model', () => {
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

  describe('Factory methods', () => {
    it('should create new sheet', () => {
      const sheet = Sheet.create(
        'Sheet1',
        null,
        mockData,
        'Document Title',
        mockSections
      )

      expect(sheet.name).toBe('Sheet1')
      expect(sheet.title).toBe('Document Title')
      expect(sheet.sections).toHaveLength(1)
    })

    it('should create from config', () => {
      const config: SheetConfig = {
        name: 'Sheet1',
        worksheet: null,
        rawData: mockData,
        title: 'Document Title',
        sections: [mockSections[0]!.toConfig()],
      }

      const sheet = Sheet.fromConfig(config)

      expect(sheet.name).toBe('Sheet1')
      expect(sheet.sections).toHaveLength(1)
    })
  })

  describe('Getters', () => {
    it('should get name', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      expect(sheet.name).toBe('Test')
    })

    it('should get title', () => {
      const sheet = Sheet.create('Test', null, mockData, 'My Title', mockSections)
      expect(sheet.title).toBe('My Title')
    })

    it('should get rawData as readonly', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const data = sheet.rawData
      
      expect(data).toEqual(mockData)
      expect(data).toHaveLength(5)
    })

    it('should get sections as Section instances', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const sections = sheet.sections
      
      expect(sections).toHaveLength(1)
      expect(sections[0]).toBeInstanceOf(Section)
    })
  })

  describe('Section operations', () => {
    it('should update section', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      
      const updated = sheet.updateSection(0, section =>
        section.withTitle('New Title')
      )

      expect(sheet.sections[0]!.title).toBe('Section 1')
      expect(updated.sections[0]!.title).toBe('New Title')
    })

    it('should get section by index', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const section = sheet.getSection(0)
      
      expect(section).toBeDefined()
      expect(section?.title).toBe('Section 1')
    })

    it('should return undefined for invalid index', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      expect(sheet.getSection(999)).toBeUndefined()
    })

    it('should not mutate original on update', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const updated = sheet.updateSection(0, s => s.withTitle('Changed'))
      
      expect(sheet).not.toBe(updated)
      expect(sheet.sections[0]!.title).toBe('Section 1')
    })
  })

  describe('Query methods', () => {
    it('should get metadata', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const metadata = sheet.getMetadata()
      
      expect(metadata.totalRows).toBe(5)
      expect(metadata.totalColumns).toBe(1)
      expect(metadata.sectionCount).toBe(1)
      expect(metadata.hasTitle).toBe(true)
      expect(metadata.isEmpty).toBe(false)
    })

    it('should detect empty sheet', () => {
      const emptySheet = Sheet.create('Test', null, [], '', [])
      const metadata = emptySheet.getMetadata()
      
      expect(metadata.isEmpty).toBe(true)
      expect(metadata.totalRows).toBe(0)
    })

    it('should count sections', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      expect(sheet.getSectionCount()).toBe(1)
    })

    it('should check if has sections', () => {
      const withSections = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const withoutSections = Sheet.create('Test', null, [[]], '', [])
      
      expect(withSections.hasSections()).toBe(true)
      expect(withoutSections.hasSections()).toBe(false)
    })

    it('should check if empty', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const emptySheet = Sheet.create('Test', null, [], '', [])
      
      expect(sheet.isEmpty()).toBe(false)
      expect(emptySheet.isEmpty()).toBe(true)
    })
  })

  describe('Serialization', () => {
    it('should convert to config', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const config = sheet.toConfig()
      
      expect(config.name).toBe('Test')
      expect(config.title).toBe('Title')
      expect(config.rawData).toEqual(mockData)
      expect(config.sections).toHaveLength(1)
    })

    it('should convert to JSON', () => {
      const sheet = Sheet.create('Test', null, mockData, 'Title', mockSections)
      const json = sheet.toJSON()
      
      expect(json.name).toBe('Test')
      expect(json.sections).toHaveLength(1)
    })

    it('should preserve section configs when serializing', () => {
      const section = mockSections[0]!.withSearchText('test')
      const sheet = Sheet.create('Test', null, mockData, 'Title', [section])
      
      const config = sheet.toConfig()
      
      expect(config.sections[0]!.searchText).toBe('test')
    })
  })

  describe('Complex scenarios', () => {
    it('should handle multiple sections', () => {
      const sections = [
        Section.create('Section 1', ['A'], [['1']]),
        Section.create('Section 2', ['B'], [['2']]),
        Section.create('Section 3', ['C'], [['3']]),
      ]

      const sheet = Sheet.create('Test', null, [[]], '', sections)
      
      expect(sheet.getSectionCount()).toBe(3)
      expect(sheet.getSection(1)?.title).toBe('Section 2')
    })

    it('should update specific section without affecting others', () => {
      const sections = [
        Section.create('Section 1', ['A'], [['1']]),
        Section.create('Section 2', ['B'], [['2']]),
      ]

      const sheet = Sheet.create('Test', null, [[]], '', sections)
      const updated = sheet.updateSection(0, s => s.withTitle('Updated'))
      
      expect(updated.getSection(0)?.title).toBe('Updated')
      expect(updated.getSection(1)?.title).toBe('Section 2')
    })
  })
})