import { describe, it, expect } from 'vitest'
import { FilterService } from '@/services/FilterService'
import type { SectionConfig } from '@/types'
import type { Cell } from 'exceljs'

function makeCell(value: any): Cell {
  return { value } as Cell
}

describe('FilterService', () => {
  const mockSection: SectionConfig = {
    header: [makeCell('Name'), makeCell('Age'), makeCell('City')],
    data: [
      [makeCell('Alice'), makeCell(30), makeCell('Paris')],
      [makeCell('Bob'), makeCell(25), makeCell('London')],
      [makeCell('Charlie'), makeCell(35), makeCell('Paris')],
      [makeCell('David'), makeCell(28), makeCell('Berlin')],
    ],
  }

  describe('filterSectionData', () => {
    it('should return all data when no search text', () => {
      const result = FilterService.filterSectionData(mockSection)
      expect(result).toEqual(mockSection.data)
    })

    it('should filter by search text (case insensitive)', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: 'paris',
      }
      const result = FilterService.filterSectionData(section)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual([makeCell('Alice'), makeCell(30), makeCell('Paris')])
      expect(result[1]).toEqual([makeCell('Charlie'), makeCell(35), makeCell('Paris')])
    })

    it('should search across all columns', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: '30',
      }
      const result = FilterService.filterSectionData(section)
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual([makeCell('Alice'), makeCell(30), makeCell('Paris')])
    })

    it('should return empty array when no matches', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: 'xyz',
      }
      const result = FilterService.filterSectionData(section)
      expect(result).toHaveLength(0)
    })
  })

  describe('sortSectionData', () => {
    it('should return original data when no sort config', () => {
      const result = FilterService.sortSectionData(mockSection.data)
      expect(result).toEqual(mockSection.data)
    })

    it('should sort strings ascending', () => {
      const result = FilterService.sortSectionData(mockSection.data, {
        columnIndex: 0,
        direction: 'asc',
      })
      expect(result[0]![0]?.value).toBe('Alice')
      expect(result[1]![0]?.value).toBe('Bob')
      expect(result[2]![0]?.value).toBe('Charlie')
      expect(result[3]![0]?.value).toBe('David')
    })

    it('should sort strings descending', () => {
      const result = FilterService.sortSectionData(mockSection.data, {
        columnIndex: 0,
        direction: 'desc',
      })
      expect(result[0]![0]?.value).toBe('David')
      expect(result[1]![0]?.value).toBe('Charlie')
      expect(result[2]![0]?.value).toBe('Bob')
      expect(result[3]![0]?.value).toBe('Alice')
    })

    it('should sort numbers ascending', () => {
      const result = FilterService.sortSectionData(mockSection.data, {
        columnIndex: 1,
        direction: 'asc',
      })
      expect(result[0]![1]?.value).toBe(25)
      expect(result[1]![1]?.value).toBe(28)
      expect(result[2]![1]?.value).toBe(30)
      expect(result[3]![1]?.value).toBe(35)
    })

    it('should sort numbers descending', () => {
      const result = FilterService.sortSectionData(mockSection.data, {
        columnIndex: 1,
        direction: 'desc',
      })
      expect(result[0]![1]?.value).toBe(35)
      expect(result[1]![1]?.value).toBe(30)
      expect(result[2]![1]?.value).toBe(28)
      expect(result[3]![1]?.value).toBe(25)
    })

    it('should handle null/undefined values', () => {
      const dataWithNulls = [
        [makeCell('Alice'), makeCell(30)],
        [makeCell('Bob'), makeCell(null)],
        [makeCell('Charlie'), makeCell(undefined)],
        [makeCell('David'), makeCell(25)],
      ]
      const result = FilterService.sortSectionData(dataWithNulls, {
        columnIndex: 1,
        direction: 'asc',
      })

      console.log(result)
      // Nulls should be at the end
      expect(result[0]![1]?.value).toBe(25)
      expect(result[1]![1]?.value).toBe(30)
      expect(result[2]![1]?.value).toBe(null)
      expect(result[3]![1]?.value).toBe(undefined)
    })
  })

  describe('applyFiltersAndSort', () => {
    it('should apply both search and sort', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: 'paris',
        sortConfig: {
          columnIndex: 1,
          direction: 'desc',
        },
      }
      const result = FilterService.applyFiltersAndSort(section)
      expect(result).toHaveLength(2)
      expect(result[0]![0]?.value).toBe('Charlie') // Age 35
      expect(result[1]![0]?.value).toBe('Alice')   // Age 30
    })

    it('should return all data sorted when no search', () => {
      const section: SectionConfig = {
        ...mockSection,
        sortConfig: {
          columnIndex: 0,
          direction: 'asc',
        },
      }
      const result = FilterService.applyFiltersAndSort(section)
      expect(result).toHaveLength(4)
      expect(result[0]![0]?.value).toBe('Alice')
    })

    it('should return filtered data unsorted when no sort config', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: 'paris',
      }
      const result = FilterService.applyFiltersAndSort(section)
      expect(result).toHaveLength(2)
    })
  })

  describe('hasActiveSearch', () => {
    it('should return true when search text exists', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: 'test',
      }
      expect(FilterService.hasActiveSearch(section)).toBe(true)
    })

    it('should return false for empty string', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: '',
      }
      expect(FilterService.hasActiveSearch(section)).toBe(false)
    })

    it('should return false for whitespace only', () => {
      const section: SectionConfig = {
        ...mockSection,
        searchText: '   ',
      }
      expect(FilterService.hasActiveSearch(section)).toBe(false)
    })

    it('should return false when no search text', () => {
      expect(FilterService.hasActiveSearch(mockSection)).toBe(false)
    })
  })

  describe('hasActiveSort', () => {
    it('should return true when sort config exists', () => {
      const section: SectionConfig = {
        ...mockSection,
        sortConfig: { columnIndex: 0, direction: 'asc' },
      }
      expect(FilterService.hasActiveSort(section)).toBe(true)
    })

    it('should return false when no sort config', () => {
      expect(FilterService.hasActiveSort(mockSection)).toBe(false)
    })
  })
})