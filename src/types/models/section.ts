/**
 * Types relatifs aux sections
 */

import type { DataMatrix, RowData } from '../common/base'
import type { ChartConfig } from './chart'
import type { CardRecapConfig } from './card'

/**
 * Configuration d'une section
 */
export interface SectionConfig {
  /** Titre optionnel de la section */
  title?: string
  
  /** En-têtes de colonnes */
  header: RowData
  
  /** Données de la section */
  data: DataMatrix
  
  /** Configuration de la carte récap (optionnel) */
  cardRecap?: CardRecapConfig
  
  /** Configurations des graphiques */
  charts?: ChartConfig[]
  
  /** Configuration de recherche/filtre */
  searchText?: string
}

/**
 * Métadonnées d'une section
 */
export interface SectionMetadata {
  /** Nombre de colonnes */
  columnCount: number
  
  /** Nombre de lignes de données */
  rowCount: number
  
  /** Nombre de graphiques */
  chartCount: number
  
  /** Nombre de graphiques visibles */
  visibleChartCount: number
  
  /** A une carte récap */
  hasCardRecap: boolean
  
  /** A une recherche active */
  hasActiveSearch: boolean
  
  /** Est vide (pas de données) */
  isEmpty: boolean
}

/**
 * Options pour créer une section
 */
export interface CreateSectionOptions {
  title?: string
  header: RowData
  data: DataMatrix
}

/**
 * Informations de colonnes
 */
export interface ColumnInfo {
  /** Index de la colonne */
  index: number
  
  /** Label de la colonne */
  label: string
  
  /** Type détecté */
  type: 'text' | 'number' | 'date' | 'boolean' | 'mixed' | 'empty'
  
  /** Est numérique */
  isNumeric: boolean
  
  /** Est vide */
  isEmpty: boolean
  
  /** Valeurs uniques (pour les filtres) */
  uniqueValues?: Set<unknown>
}

/**
 * Analyse d'une section
 */
export interface SectionAnalysis {
  metadata: SectionMetadata
  columns: ColumnInfo[]
  numericColumns: ColumnInfo[]
  textColumns: ColumnInfo[]
}

/**
 * État complet d'une section
 */
export interface SectionState extends SectionConfig {
  metadata: SectionMetadata
  filteredData?: DataMatrix
}