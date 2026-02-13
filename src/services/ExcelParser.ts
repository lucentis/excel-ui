import type { Worksheet } from 'exceljs'
import type { DataMatrix, RowData } from '@/types'
import type { Cell } from 'exceljs'
import { CellHelper } from './CellHelper'

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
   * Check if a row is completely empty - REFACTORED with CellHelper
   */
  static isEmptyRow(row: RowData): boolean {
    return row.every(cell => CellHelper.isEmpty(cell as Cell))
  }

  /**
   * Count filled cells in a row - REFACTORED with CellHelper
   */
  static countFilledCells(row: RowData | undefined): number {
    if (!row) return 0
    return row.filter(cell => !CellHelper.isEmpty(cell as Cell)).length
  }
}