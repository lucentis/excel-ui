/**
 * Types relatifs aux feuilles Excel
 */

import type { Worksheet } from 'exceljs'
import type { DataMatrix, Nullable } from '../common/base'
import type { SectionConfig } from './section'

/**
 * Configuration d'une feuille
 */
export interface SheetConfig {
  /** Nom de la feuille */
  name: string
  
  /** Référence à la worksheet ExcelJS */
  worksheet: Nullable<Worksheet>
  
  /** Données brutes complètes */
  rawData: DataMatrix
  
  /** Titre du document (première ligne) */
  title: string
  
  /** Sections détectées */
  sections: SectionConfig[]
}

/**
 * Métadonnées d'une feuille
 */
export interface SheetMetadata {
  /** Nombre total de lignes */
  totalRows: number
  
  /** Nombre total de colonnes */
  totalColumns: number
  
  /** Nombre de sections */
  sectionCount: number
  
  /** A un titre */
  hasTitle: boolean
  
  /** Est vide */
  isEmpty: boolean
}

/**
 * Options pour créer une feuille
 */
export interface CreateSheetOptions {
  name: string
  worksheet: Nullable<Worksheet>
  rawData: DataMatrix
}

/**
 * État complet d'une feuille
 */
export interface SheetState extends SheetConfig {
  metadata: SheetMetadata
}

/**
 * Résumé d'une feuille (pour la liste)
 */
export interface SheetSummary {
  name: string
  title: string
  sectionCount: number
  rowCount: number
  isEmpty: boolean
}