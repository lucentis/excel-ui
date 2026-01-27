import { CardRecap } from '@/models'
import type { 
  SectionConfig,
  RowIndex,
  ColumnIndex,
  CellValue,
} from '@/types'

/**
 * CardService
 * Business logic for recap card operations
 */
export class CardService {
  /**
   * Create a card recap from a cell in a section
   */
  static createCardRecap(
    section: SectionConfig, 
    rowIndex: RowIndex, 
    colIndex: ColumnIndex
  ): CardRecap {
    // If no data rows, take value from header itself (single-line section)
    const value: CellValue = section.data.length > 0 
      ? section.data[rowIndex]?.[colIndex] 
      : section.header[colIndex]

    const label = section.data.length > 0 
      ? String(section.header[colIndex] || '') 
      : String(section.header[0] || '')

    return CardRecap.create(rowIndex, colIndex, value, label)
  }

  /**
   * Format a card value for display
   */
  static formatCardValue(value: unknown): string {
    if (value === null || value === undefined) return '-'

    if (typeof value === 'number') {
      return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 2,
      }).format(value)
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR')
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    return String(value)
  }

  /**
   * Check if a value is numeric
   */
  static isNumericValue(value: unknown): boolean {
    return typeof value === 'number'
  }

  /**
   * Get value type
   */
  static getValueType(value: unknown): 'number' | 'text' | 'date' | 'boolean' | 'empty' {
    if (value === null || value === undefined || value === '') return 'empty'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    if (value instanceof Date) return 'date'
    return 'text'
  }
}