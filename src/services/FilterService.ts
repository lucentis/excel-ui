import type { 
  SectionConfig,
  DataMatrix,
  RowData,
  SortConfig,
} from '@/types'
import type { Cell } from 'exceljs'

/**
 * FilterService
 * Business logic for filtering and search operations
 */
export class FilterService {
  /**
   * Check if a row matches search text
   */
  static matchesSearchText(row: RowData, searchText: string): boolean {
    if (!searchText.trim()) return true

    const search = searchText.toLowerCase()
    
    return row.some(cell => {
      if (cell === null || cell === undefined) return false
      
      return String(cell).toLowerCase().includes(search)
    })
  }

  /**
   * Filter section data based on search text
   */
  static filterSectionData(section: SectionConfig): DataMatrix {
    if (!section.searchText) return section.data

    return section.data.filter(row => 
      this.matchesSearchText(row, section.searchText!)
    )
  }

  /**
   * Compare two values for sorting
   */
  // services/FilterService.ts
  private static compareValues(a: Cell, b: Cell, direction: 'asc' | 'desc'): number {
    let valueA = a.result ?? a.value ?? a
    let valueB = b.result ?? b.value ?? b
    
    // Handle null/undefined
    if (valueA === null || valueA === undefined) return direction === 'asc' ? 1 : -1
    if (valueB === null || valueB === undefined) return direction === 'asc' ? -1 : 1

    // Numbers
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA
    }

    // Dates
    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === 'asc' 
        ? valueA.getTime() - valueB.getTime() 
        : valueB.getTime() - valueA.getTime()
    }

    // Strings (default)
    const strA = String(valueA).toLowerCase()
    const strB = String(valueB).toLowerCase()
    
    return direction === 'asc' 
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA)
  }

  /**
   * Sort section data
   */
  static sortSectionData(data: DataMatrix, sortConfig?: SortConfig): DataMatrix {
    if (!sortConfig) return data

    const { columnIndex, direction } = sortConfig

    return [...data].sort((rowA, rowB) => {
      const valueA = rowA[columnIndex]!
      const valueB = rowB[columnIndex]!
      return this.compareValues(valueA, valueB, direction)
    })
  }

  /**
   * Apply both filtering and sorting
   */
  static applyFiltersAndSort(section: SectionConfig): DataMatrix {
    // First filter
    let result = this.filterSectionData(section)

    // Then sort
    result = this.sortSectionData(result, section.sortConfig)

    return result
  }

  /**
   * Get filtered row count
   */
  static getFilteredRowCount(section: SectionConfig): number {
    return this.filterSectionData(section).length
  }

  /**
   * Check if section has active search
   */
  static hasActiveSearch(section: SectionConfig): boolean {
    return !!section.searchText && section.searchText.trim().length > 0
  }

  /**
   * Check if section has active sort
   */
  static hasActiveSort(section: SectionConfig): boolean {
    return !!section.sortConfig
  }
}