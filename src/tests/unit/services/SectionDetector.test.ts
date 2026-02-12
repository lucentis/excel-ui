import { describe, it, expect } from 'vitest'
import { SectionDetector } from '@/services/SectionDetector'
import type { DataMatrix } from '@/types'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('SectionDetector', () => {
  describe('detectSections', () => {
    it('should detect single section with title', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Section 1')],
        [makeCell('Name'), makeCell('Value')],
        [makeCell('Alice'), makeCell(100)],
        [makeCell('Bob'), makeCell(200)],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title?.value).toBe('Section 1')
      expect(sections[0]!.header[0]?.value).toBe('Name')
      expect(sections[0]!.header[1]?.value).toBe('Value')
      expect(sections[0]!.data).toHaveLength(2)
    })

    it('should detect section without title (direct header)', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Name'), makeCell('Value'), makeCell('City')],
        [makeCell('Alice'), makeCell(100), makeCell('Paris')],
        [makeCell('Bob'), makeCell(200), makeCell('London')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBeUndefined()
      expect(sections[0]!.header[0]?.value).toBe('Name')
      expect(sections[0]!.header[1]?.value).toBe('Value')
      expect(sections[0]!.header[2]?.value).toBe('City')
      expect(sections[0]!.data).toHaveLength(2)
    })

    it('should detect multiple sections', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Section 1')],
        [makeCell('Col1'), makeCell('Col2')],
        [makeCell('A'), makeCell(1)],
        [makeCell('B'), makeCell(2)],
        [],
        [makeCell('Section 2')],
        [makeCell('Col3'), makeCell('Col4')],
        [makeCell('C'), makeCell(3)],
        [makeCell('D'), makeCell(4)],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(2)
      expect(sections[0]!.title?.value).toBe('Section 1')
      expect(sections[1]!.title?.value).toBe('Section 2')
      expect(sections[0]!.data).toHaveLength(2)
      expect(sections[1]!.data).toHaveLength(2)
    })

    it('should handle section with no data rows', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Section Title')],
        [makeCell('Header1'), makeCell('Header2')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title?.value).toBe('Section Title')
      expect(sections[0]!.header[0]?.value).toBe('Header1')
      expect(sections[0]!.header[1]?.value).toBe('Header2')
      expect(sections[0]!.data).toHaveLength(0)
    })

    it('should handle multiple empty rows between sections', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [],
        [makeCell('Section 1')],
        [makeCell('Col1')],
        [makeCell('A')],
        [],
        [],
        [],
        [makeCell('Section 2')],
        [makeCell('Col2')],
        [makeCell('B')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(2)
      expect(sections[0]!.title?.value).toBe('Section 1')
      expect(sections[1]!.title?.value).toBe('Section 2')
    })

    it('should detect section without title when first row has multiple cells', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Name'), makeCell('Age'), makeCell('City')],
        [makeCell('Alice'), makeCell(30), makeCell('Paris')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBeUndefined()
      expect(sections[0]!.header[0]?.value).toBe('Name')
      expect(sections[0]!.header[1]?.value).toBe('Age')
      expect(sections[0]!.header[2]?.value).toBe('City')
      expect(sections[0]!.data).toHaveLength(1)
    })

    it('should handle empty document', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(0)
    })

    it('should finalize last section even without trailing empty row', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Section')],
        [makeCell('Header')],
        [makeCell('Data1')],
        [makeCell('Data2')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.data).toHaveLength(2)
    })

    it('should distinguish title from header by cell count', () => {
      const rawData: DataMatrix = [
        [makeCell('Document Title')],
        [],
        [makeCell('Single Cell Title')],
        [makeCell('Header1'), makeCell('Header2'), makeCell('Header3')],
        [makeCell('A'), makeCell('B'), makeCell('C')],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title?.value).toBe('Single Cell Title')
      expect(sections[0]!.header[0]?.value).toBe('Header1')
      expect(sections[0]!.header[1]?.value).toBe('Header2')
      expect(sections[0]!.header[2]?.value).toBe('Header3')
    })
  })
})