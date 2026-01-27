/**
 * Types relatifs aux filtres et recherche
 */

import type { RowData, ColumnIndex } from '../common/base'

/**
 * Type de filtre
 */
export enum FilterType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
}

/**
 * Opérateurs de comparaison
 */
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_OR_EQUAL = 'greater_or_equal',
  LESS_OR_EQUAL = 'less_or_equal',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
}

/**
 * Configuration d'un filtre
 */
export interface FilterConfig {
  /** Type de filtre */
  type: FilterType
  
  /** Opérateur */
  operator: FilterOperator
  
  /** Valeur de comparaison */
  value?: unknown
  
  /** Colonne cible (optionnel, null = toutes colonnes) */
  columnIndex?: ColumnIndex | null
  
  /** Case sensitive pour les filtres texte */
  caseSensitive?: boolean
}

/**
 * Configuration de recherche simple
 */
export interface SearchConfig {
  /** Texte recherché */
  text: string
  
  /** Case sensitive */
  caseSensitive?: boolean
  
  /** Colonnes cibles (null = toutes) */
  columns?: ColumnIndex[] | null
}

/**
 * Résultat d'un filtre
 */
export interface FilterResult {
  /** Lignes correspondantes */
  matchedRows: RowData[]
  
  /** Indices des lignes correspondantes */
  matchedIndices: number[]
  
  /** Nombre de correspondances */
  count: number
  
  /** Nombre total de lignes */
  totalCount: number
}

/**
 * Ensemble de filtres (ET logique)
 */
export interface FilterSet {
  filters: FilterConfig[]
}

/**
 * Fonction de prédicat pour filtrer
 */
export type FilterPredicate = (row: RowData, index: number) => boolean