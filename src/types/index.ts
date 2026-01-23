import type { Workbook, Worksheet } from 'exceljs'

export interface Section {
  title?: string
  header: string[]
  data: unknown[][]
  cardRecap?: CardRecap
  charts?: Chart[]
}

export interface CardRecap {
  rowIndex: number
  colIndex: number
  value: unknown
  label?: string
}

export interface Chart {
  columnIndex: number // Colonne pour les valeurs (Y)
  labelColumnIndex: number // Colonne pour les labels (X)
  type: ChartType
  excludedRows: number[] // ✨ Nouveau : indices des lignes à exclure
  visible: boolean
}

export type ChartType = 'bar' | 'pie' | 'line'

export interface CurrentSheet {
  name: string
  workSheet: Worksheet | null
  rawData: unknown[][]
  title: string
  sections: Section[]
}

export interface ExcelStore {
  workbook: Workbook | null
  fileName: string
  sheetNames: string[]
  currentSheet: CurrentSheet
}