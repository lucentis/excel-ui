import { CardRecap } from '@/models'
import type { 
  SectionConfig,
  RowIndex,
  ColumnIndex,
  CardStyleConfig,
} from '@/types'
import type { Cell } from 'exceljs'

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

    const cardRecap = CardRecap.create(rowIndex, colIndex, value as Cell, label as Cell)

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
}