/**
 * Types relatifs au workbook Excel
 */

import type { Workbook } from 'exceljs'
import type { Nullable } from '../common/base'
import type { SheetConfig, SheetSummary } from './sheet'

/**
 * Configuration d'un workbook
 */
export interface WorkbookConfig {
  /** Référence au workbook ExcelJS */
  workbook: Nullable<Workbook>
  
  /** Nom du fichier */
  fileName: string
  
  /** Noms des feuilles */
  sheetNames: string[]

  sheets: Record<string, SheetConfig>
  
  /** Feuille actuellement sélectionnée */
  currentSheet: SheetConfig
}

/**
 * Métadonnées d'un workbook
 */
export interface WorkbookMetadata {
  /** Nombre de feuilles */
  sheetCount: number
  
  /** Taille du fichier (optionnel) */
  fileSize?: number
  
  /** Date de chargement */
  loadedAt: Date
  
  /** Est vide */
  isEmpty: boolean
}

/**
 * Options pour charger un workbook
 */
export interface LoadWorkbookOptions {
  /** Fichier à charger */
  file: File
  
  /** Feuille à sélectionner par défaut (null = première feuille) */
  defaultSheet?: string | null
}

/**
 * État complet d'un workbook
 */
export interface WorkbookState extends WorkbookConfig {
  metadata: WorkbookMetadata
}

/**
 * Résumé du workbook (pour l'UI)
 */
export interface WorkbookSummary {
  fileName: string
  sheetCount: number
  sheets: SheetSummary[]
  currentSheetName: string
  loadedAt: Date
}

/**
 * Événements du workbook
 */
export enum WorkbookEvent {
  LOADED = 'workbook:loaded',
  SHEET_CHANGED = 'workbook:sheet_changed',
  CLEARED = 'workbook:cleared',
}