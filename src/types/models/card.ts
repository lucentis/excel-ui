/**
 * Types relatifs aux cartes récapitulatives
 */

import type { Cell, CellValue } from 'exceljs'
import type { RowIndex, ColumnIndex } from '../common/base'

/**
 * Color theme for card
 */
export type CardColorTheme = 
  | 'slate' | 'neutral' | 'red' | 'orange' | 'amber' | 'yellow'
  | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

/**
 * Card size options
 */
export type CardSize = 'small' | 'medium' | 'large'

/**
 * Icon position options
 */
export type CardIconPosition = 'top' | 'left' | 'right' | 'none'

/**
 * Typography size options
 */
export type CardTitleSize = 'small' | 'medium' | 'large'
export type CardValueSize = 'small' | 'medium' | 'large' | 'xlarge'

/**
 * Value format options
 */
export type CardValueFormat = 'number' | 'integer' | 'percentage' | 'currency'

/**
 * Typography configuration
 */
export interface CardTypography {
  /** Title text size */
  titleSize: CardTitleSize
  
  /** Value text size */
  valueSize: CardValueSize
}

/**
 * Value format configuration
 */
export interface CardValueFormatConfig {
  /** Format type */
  type: CardValueFormat
  
  /** Custom unit for currency format */
  customUnit?: string
}

/**
 * Card style configuration
 */
export interface CardStyleConfig {
  /** Color theme */
  colorTheme: CardColorTheme
  
  /** Card size */
  size: CardSize
  
  /** Icon position */
  iconPosition: CardIconPosition
  
  /** Typography settings */
  typography: CardTypography
  
  /** Value format settings */
  valueFormat: CardValueFormatConfig
}

/**
 * Default card style configuration
 */
export const DEFAULT_CARD_STYLE: CardStyleConfig = {
  colorTheme: 'blue',
  size: 'medium',
  iconPosition: 'left',
  typography: {
    titleSize: 'medium',
    valueSize: 'large',
  },
  valueFormat: {
    type: 'number',
  },
}

/**
 * Configuration d'une carte récapitulative
 */
export interface CardRecapConfig {
  /** Index de la ligne source */
  rowIndex: RowIndex
  
  /** Index de la colonne source */
  colIndex: ColumnIndex
  
  /** Valeur à afficher */
  value: CellValue
  
  /** Label de la carte */
  label: Cell
  
  /** Unité (optionnel: €, %, etc.) */
  unit?: string
  
  /** Couleur personnalisée */
  color?: string
  
  /** Icône personnalisée */
  icon?: string
  
  /** Style configuration */
  style?: CardStyleConfig
}

/**
 * Options pour créer une carte récap
 */
export interface CreateCardRecapOptions {
  rowIndex: RowIndex
  colIndex: ColumnIndex
  label?: string
  unit?: string
  color?: string
  icon?: string
  style?: Partial<CardStyleConfig>
}

/**
 * Données formatées pour l'affichage d'une carte
 */
export interface CardRecapDisplay {
  /** Titre de la carte */
  title: string
  
  /** Label de la valeur */
  label: string
  
  /** Valeur formatée */
  formattedValue: string
  
  /** Valeur brute */
  rawValue: CellValue
  
  /** Unité (si applicable) */
  unit?: string
  
  /** Couleur */
  color: string
  
  /** Icône */
  icon?: string
  
  /** Style configuration */
  style: CardStyleConfig
}

/**
 * Validation du type de valeur pour les cartes
 */
export type CardValueType = 'number' | 'text' | 'date' | 'boolean' | 'empty'

/**
 * Métadonnées d'une carte
 */
export interface CardRecapMetadata {
  valueType: CardValueType
  isNumeric: boolean
  isEmpty: boolean
}