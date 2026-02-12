import { HyperFormula, type ExportedChange } from 'hyperformula'
import type { Cell } from 'exceljs'
import type { DataMatrix } from '@/types'

/**
 * Formula calculation engine using HyperFormula
 */
class FormulaEngine {
  private engine: HyperFormula | null = null
  private sheetMapping: Map<string, number> = new Map()

  /**
   * Initialize engine with workbook data
   */
  initialize(
    sheets: Record<string, DataMatrix>,
    sheetNames: string[]
  ): void {

    const sheetsData: Record<string, (string | number | boolean | null)[][]> = {}

    // Build raw matrix for HyperFormula
    sheetNames.forEach(sheetName => {
      const rawData = sheets[sheetName] || []

      const sheetData = rawData.map(row =>
        row.map(cell => this.extractCellValue(cell as Cell))
      )

      console.log(sheetData);
      
      sheetsData[sheetName] = sheetData
    })

    // Create engine
    this.engine = HyperFormula.buildFromSheets(sheetsData, {
      licenseKey: 'gpl-v3',
    })

    // Safe sheetId mapping
    this.sheetMapping.clear()

    sheetNames.forEach(sheetName => {
      const id = this.engine!.getSheetId(sheetName)
      if (id !== undefined) {
        this.sheetMapping.set(sheetName, id)
      }
    })
  }

  /**
   * Extract value from ExcelJS Cell for HyperFormula
   */
  private extractCellValue(
    cell: Cell
  ): string | number | boolean | null {

    if (!cell) return null

    const value = (cell as any).value

    if (value === null || value === undefined) return null

    // Formula
    if (typeof value === 'object' && 'formula' in value) {
      return `=${value.formula}`
    }

    // Primitive values
    if (
      typeof value === 'number' ||
      typeof value === 'string' ||
      typeof value === 'boolean'
    ) {
      return value
    }

    // Date -> convert to Excel serial date
    if (value instanceof Date) {
      return this.convertDateToExcelSerial(value)
    }

    // Rich text
    if (typeof value === 'object' && 'richText' in value) {
      return value.richText.map((t: any) => t.text).join('')
    }

    // Hyperlink
    if (typeof value === 'object' && 'text' in value) {
      return value.text
    }

    return null
  }

  /**
   * Convert JS Date to Excel serial number
   */
  private convertDateToExcelSerial(date: Date): number {
    const excelEpoch = new Date(1899, 11, 30)
    const diff = date.getTime() - excelEpoch.getTime()
    return diff / (1000 * 60 * 60 * 24)
  }

  /**
   * Update cell and get all recalculated cells
   */
  setCellValue(
    sheetName: string,
    row: number,
    col: number,
    newValue: string | number | boolean
  ): ExportedChange[] {

    if (!this.engine) {
      console.warn('Formula engine not initialized')
      return []
    }

    const sheetId = this.sheetMapping.get(sheetName)
    if (sheetId === undefined) {
      console.warn(`Sheet "${sheetName}" not found in engine`)
      return []
    }

    try {
      return this.engine.setCellContents(
        { sheet: sheetId, row, col },
        newValue
      )
    } catch (error) {
      console.error('Formula engine error:', error)
      return []
    }
  }

  /**
   * Destroy engine instance
   */
  destroy(): void {
    this.engine = null
    this.sheetMapping.clear()
  }
}

export const formulaEngine = new FormulaEngine()
