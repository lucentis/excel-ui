import type { 
    SectionConfig,
    DataMatrix,
    RowData,
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
  }