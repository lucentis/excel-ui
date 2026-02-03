/**
 * Types utilitaires de base
 */

import type { CellValue } from "exceljs"

/**
 * Identifiant unique
 */
export type ID = string | number

/**
 * Timestamp Unix
 */
export type Timestamp = number

/**
 * Type pour valeurs optionnelles avec null
 */
export type Nullable<T> = T | null

/**
 * Type pour valeurs optionnelles avec undefined
 */
export type Optional<T> = T | undefined

/**
 * Type pour rendre toutes les propriétés optionnelles de manière profonde
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Type pour rendre toutes les propriétés readonly de manière profonde
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * Ligne de données (tableau de cellules)
 */
export type RowData = CellValue[]

/**
 * Matrice de données (tableau de lignes)
 */
export type DataMatrix = RowData[]

/**
 * Index de ligne/colonne
 */
export type RowIndex = number
export type ColumnIndex = number

/**
 * Position dans une grille
 */
export interface GridPosition {
  row: RowIndex
  column: ColumnIndex
}

/**
 * Plage de sélection
 */
export interface GridRange {
  start: GridPosition
  end: GridPosition
}