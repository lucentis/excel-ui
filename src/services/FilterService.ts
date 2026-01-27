import type { 
  SectionConfig,
  DataMatrix,
  RowData,
  SortConfig,
} from '@/types'

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
  private static compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
    // Handle null/undefined
    if (a === null || a === undefined) return direction === 'asc' ? 1 : -1
    if (b === null || b === undefined) return direction === 'asc' ? -1 : 1

    // Numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return direction === 'asc' ? a - b : b - a
    }

    // Dates
    if (a instanceof Date && b instanceof Date) {
      return direction === 'asc' 
        ? a.getTime() - b.getTime() 
        : b.getTime() - a.getTime()
    }

    // Strings (default)
    const strA = String(a).toLowerCase()
    const strB = String(b).toLowerCase()
    
    if (direction === 'asc') {
      return strA.localeCompare(strB)
    } else {
      return strB.localeCompare(strA)
    }
  }

  /**
   * Sort section data
   */
  static sortSectionData(data: DataMatrix, sortConfig?: SortConfig): DataMatrix {
    if (!sortConfig) return data

    const { columnIndex, direction } = sortConfig

    return [...data].sort((rowA, rowB) => {
      const valueA = rowA[columnIndex]
      const valueB = rowB[columnIndex]
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