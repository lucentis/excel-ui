import type { Workbook, Worksheet } from 'exceljs'

export interface CardRecap {
  rowIndex: number
  colIndex: number
  value: unknown
  label?: string
}

export interface Section {
  title?: string
  header: string[]
  data: unknown[][]
  cardRecap?: CardRecap
}

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
