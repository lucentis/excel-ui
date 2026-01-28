import { describe, it, expect } from 'vitest'
import { SectionDetector } from '@/services/SectionDetector'
import type { DataMatrix } from '@/types'

describe('SectionDetector', () => {
  describe('detectSections', () => {
    it('should detect single section with title', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Section 1'],
        ['Name', 'Value'],
        ['Alice', 100],
        ['Bob', 200],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBe('Section 1')
      expect(sections[0]!.header).toEqual(['Name', 'Value'])
      expect(sections[0]!.data).toHaveLength(2)
    })

    it('should detect section without title (direct header)', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Name', 'Value', 'City'],
        ['Alice', 100, 'Paris'],
        ['Bob', 200, 'London'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBeUndefined()
      expect(sections[0]!.header).toEqual(['Name', 'Value', 'City'])
      expect(sections[0]!.data).toHaveLength(2)
    })

    it('should detect multiple sections', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Section 1'],
        ['Col1', 'Col2'],
        ['A', 1],
        ['B', 2],
        [],
        ['Section 2'],
        ['Col3', 'Col4'],
        ['C', 3],
        ['D', 4],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(2)
      expect(sections[0]!.title).toBe('Section 1')
      expect(sections[1]!.title).toBe('Section 2')
      expect(sections[0]!.data).toHaveLength(2)
      expect(sections[1]!.data).toHaveLength(2)
    })

    it('should handle section with no data rows', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Section Title'],
        ['Header1', 'Header2'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBe('Section Title')
      expect(sections[0]!.header).toEqual(['Header1', 'Header2'])
      expect(sections[0]!.data).toHaveLength(0)
    })

    it('should handle multiple empty rows between sections', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        [],
        ['Section 1'],
        ['Col1'],
        ['A'],
        [],
        [],
        [],
        ['Section 2'],
        ['Col2'],
        ['B'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(2)
      expect(sections[0]!.title).toBe('Section 1')
      expect(sections[1]!.title).toBe('Section 2')
    })

    it('should detect section without title when first row has multiple cells', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Name', 'Age', 'City'],
        ['Alice', 30, 'Paris'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBeUndefined()
      expect(sections[0]!.header).toEqual(['Name', 'Age', 'City'])
      expect(sections[0]!.data).toHaveLength(1)
    })

    it('should handle empty document', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(0)
    })

    it('should finalize last section even without trailing empty row', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Section'],
        ['Header'],
        ['Data1'],
        ['Data2'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.data).toHaveLength(2)
    })

    it('should distinguish title from header by cell count', () => {
      const rawData: DataMatrix = [
        ['Document Title'],
        [],
        ['Single Cell Title'],
        ['Header1', 'Header2', 'Header3'],
        ['A', 'B', 'C'],
      ]

      const sections = SectionDetector.detectSections(rawData)

      expect(sections).toHaveLength(1)
      expect(sections[0]!.title).toBe('Single Cell Title')
      expect(sections[0]!.header).toEqual(['Header1', 'Header2', 'Header3'])
    })
  })
})