import type { Workbook, Worksheet } from 'exceljs'

export interface Section {
  title?: string
  header: string[]
  data: unknown[][]
  cardRecap?: {
    rowIndex: number
    colIndex: number
    value: unknown
    label?: string
  }
}

export interface ExcelStore {
  workbook: Workbook | null
  fileName: string
  sheetNames: string[]
  currentSheet: {
    workSheet: Worksheet | null
    name: string
    rawData: unknown[][]
    title: string
    sections: Section[]
  }
  selectionMode: boolean
}
