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
   * Parse cell value for display
   */
  static parseCell(cell: CellValue): CellValue {
    if (!cell || typeof cell !== 'object' || !('value' in cell)) {
      return cell
    }

    let value = (cell as any).value

    if (value && typeof value === 'object') {
      if ('result' in value) {
        value = value.result
      } else if ('richText' in value) {
        value = value.richText.map((t: any) => t.text).join('')
      } else if ('text' in value) {
        value = value.text
      }
    }

    return value
  }

  /**
   * Parse entire data matrix
   */
  static parseRawData(rawData: DataMatrix): DataMatrix {
    return rawData.map(row => 
      row.map(cell => this.parseCell(cell))
    )
  }

  /**
   * Check if a row is completely empty
   */
  static isEmptyRow(row: RowData): boolean {
    return row.every(cell => cell === null || cell === undefined || cell === '')
  }

  /**
   * Count filled cells in a row
   */
  static countFilledCells(row: RowData | undefined): number {
    if (!row) return 0
    return row.filter(cell => cell !== null && cell !== undefined && cell !== '').length
  }
}