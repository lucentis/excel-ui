import type { CellValue, Worksheet } from 'exceljs'
import type { DataMatrix, RowData } from '@/types'

/**
 * ExcelParser
 * Handles Excel worksheet parsing
 */
export class ExcelParser {
  /**
   * Extract raw data from worksheet
   * Converts special types (formulas, richText, etc.) to simple values
   */
  static extractRawData(worksheet: Worksheet): DataMatrix {
    const data: DataMatrix = []

    worksheet.eachRow({ includeEmpty: true }, (row) => {
      const rowData: RowData = []

      row.eachCell({ includeEmpty: true }, (cell) => {
        rowData.push(cell)
      })

      data.push(rowData)
    })

    return data
  }

  /**
   * Check if a row is completely empty
   */
  static isEmptyRow(row: RowData): boolean {
    return row.every(cell => cell === null || cell === undefined || (cell as any).value === '')
  }

  /**
   * Count filled cells in a row
   */
  static countFilledCells(row: RowData | undefined): number {
    if (!row) return 0
    return row.filter(cell => cell !== null && cell !== undefined).length
  }
}