/**
 * Types relatifs aux cartes récapitulatives
 */

import type { CellValue, RowIndex, ColumnIndex } from '../common/base'

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
  label?: string
  
  /** Unité (optionnel: €, %, etc.) */
  unit?: string
  
  /** Couleur personnalisée */
  color?: string
  
  /** Icône personnalisée */
  icon?: string
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