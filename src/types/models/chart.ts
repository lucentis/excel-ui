/**
 * Types relatifs aux graphiques
 */

import type { ColumnIndex, RowData, RowIndex } from '../common/base'

/**
 * Types de graphiques supportés
 */
export type ChartType = 'bar' | 'pie' | 'line'

/**
 * Configuration d'un graphique
 */
export interface ChartConfig {
  /** Colonne source des valeurs (axe Y) */
  columnIndex: ColumnIndex
  
  /** Colonne source des labels (axe X) */
  labelColumnIndex: ColumnIndex
  
  /** Type de graphique */
  type: ChartType
  
  /** Lignes exclues du graphique */
  excludedRows: RowData[]
  
  /** Visibilité du graphique */
  visible: boolean
  
  /** Couleur personnalisée (optionnel) */
  color?: string
  
  /** Titre personnalisé (optionnel) */
  title?: string
}

/**
 * Options pour créer un nouveau graphique
 */
export interface CreateChartOptions {
  columnIndex: ColumnIndex
  labelColumnIndex?: ColumnIndex
  type?: ChartType
  color?: string
  title?: string
}

/**
 * Point de données pour le graphique
 */
export interface ChartDataPoint {
  /** Index de la ligne source */
  index: RowIndex
  
  /** Label à afficher */
  name: string
  
  /** Valeur numérique */
  value: number
  
  /** Pourcentage (calculé automatiquement) */
  percentage?: number
}

/**
 * Données préparées pour le rendu du graphique
 */
export type ChartData = ChartDataPoint[]

/**
 * Métadonnées du graphique
 */
export interface ChartMetadata {
  /** Label de la colonne de valeurs */
  valueLabel: string
  
  /** Label de la colonne de labels */
  labelName: string
  
  /** Nombre de points de données */
  dataPointCount: number
  
  /** Nombre de lignes exclues */
  excludedCount: number
}

/**
 * État complet d'un graphique (config + data + metadata)
 */
export interface ChartState {
  config: ChartConfig
  data: ChartData
  metadata: ChartMetadata
}