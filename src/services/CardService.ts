import { CardRecap } from '@/models'
import type { 
  SectionConfig,
  RowIndex,
  ColumnIndex,
  CardStyleConfig,
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
    colIndex: ColumnIndex,
    style?: Partial<CardStyleConfig>
  ): CardRecap {
    // If no data rows, take value from header itself (single-line section)
    const value = section.data.length > 0 
      ? section.data[rowIndex]?.[colIndex] 
      : section.header[colIndex]

    const label = section.data.length > 0 
      ? section.header[colIndex]  
      : section.header[0]

    const cardRecap = CardRecap.create(rowIndex, colIndex, value!, label!)

    // Apply style if provided
    if (style) {
      return cardRecap.withStyle(style)
    }

    return cardRecap
  }

  /**
   * Update card style configuration
   */
  static updateCardStyle(
    cardRecap: CardRecap,
    style: Partial<CardStyleConfig>
  ): CardRecap {
    return cardRecap.withStyle(style)
  }

  /**
   * Update full card style configuration
   */
  static setCardStyle(
    cardRecap: CardRecap,
    style: CardStyleConfig
  ): CardRecap {
    return cardRecap.withFullStyle(style)
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