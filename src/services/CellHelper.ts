import type { Cell, CellValue, CellRichTextValue, CellHyperlinkValue, CellFormulaValue } from 'exceljs'

/**
 * CellHelper Service
 * Centralized logic for extracting and working with Excel Cell objects
 */
export class CellHelper {
  /**
   * Get display value (computed result or raw value)
   * Use this when you need the final calculated value to show to user
   */
  static getDisplayValue(cell: Cell | undefined): any {
    if (!cell) return null
    
    const value = cell.value
    
    // Handle formula cells - return result
    if (value && typeof value === 'object' && 'result' in value) {
      return value.result ?? null
    }
    
    // Handle rich text - concatenate text parts
    if (this.hasRichText(cell)) {
      const richText = this.getRichText(cell)
      return richText?.map(part => part.text).join('') ?? null
    }
    
    // Handle hyperlink - return text
    if (this.hasHyperlink(cell)) {
      const hyperlink = value as CellHyperlinkValue
      return hyperlink.text ?? hyperlink.hyperlink ?? null
    }
    
    return value ?? null
  }

  /**
   * Get raw value (for editing or internal processing)
   * Use this when you need the original cell value structure
   */
  static getRawValue(cell: Cell | undefined): CellValue {
    if (!cell) return null
    return cell.value ?? null
  }

  /**
   * Check if cell has a formula
   */
  static hasFormula(cell: Cell | undefined): boolean {
    if (!cell) return false
    const value = cell.value
    return value !== null && 
           value !== undefined && 
           typeof value === 'object' && 
           'formula' in value
  }

  /**
   * Get formula string if exists
   */
  static getFormula(cell: Cell | undefined): string | undefined {
    if (!this.hasFormula(cell)) return undefined
    const value = cell!.value as CellFormulaValue
    return value.formula
  }

  /**
   * Get formula result if exists
   */
  static getFormulaResult(cell: Cell | undefined): any {
    if (!this.hasFormula(cell)) return undefined
    const value = cell!.value as CellFormulaValue
    return value.result
  }

  /**
   * Check if cell has rich text
   */
  static hasRichText(cell: Cell | undefined): boolean {
    if (!cell) return false
    const value = cell.value
    return value !== null && 
           value !== undefined && 
           typeof value === 'object' && 
           'richText' in value
  }

  /**
   * Get rich text array if exists
   */
  static getRichText(cell: Cell | undefined): CellRichTextValue['richText'] | undefined {
    if (!this.hasRichText(cell)) return undefined
    const value = cell!.value as CellRichTextValue
    return value.richText
  }

  /**
   * Check if cell has hyperlink
   */
  static hasHyperlink(cell: Cell | undefined): boolean {
    if (!cell) return false
    const value = cell.value
    return value !== null && 
           value !== undefined && 
           typeof value === 'object' && 
           'hyperlink' in value
  }

  /**
   * Get hyperlink URL if exists
   */
  static getHyperlink(cell: Cell | undefined): string | undefined {
    if (!this.hasHyperlink(cell)) return undefined
    const value = cell!.value as CellHyperlinkValue
    return value.hyperlink
  }

  /**
   * Get hyperlink display text if exists
   */
  static getHyperlinkText(cell: Cell | undefined): string | undefined {
    if (!this.hasHyperlink(cell)) return undefined
    const value = cell!.value as CellHyperlinkValue
    return value.text
  }

  /**
   * Get cell content type
   */
  static getCellType(cell: Cell | undefined): 'primitive' | 'formula' | 'richText' | 'hyperlink' | 'empty' {
    if (!cell || cell.value === null || cell.value === undefined) {
      return 'empty'
    }
    
    const value = cell.value
    
    if (typeof value === 'object') {
      if ('formula' in value) return 'formula'
      if ('richText' in value) return 'richText'
      if ('hyperlink' in value) return 'hyperlink'
    }
    
    return 'primitive'
  }

  /**
   * Check if cell is editable
   * Currently supports primitive values and formulas
   */
  static isEditable(cell: Cell | undefined): boolean {
    const type = this.getCellType(cell)
    return type === 'primitive' || type === 'formula'
  }

  /**
   * Check if cell is empty
   */
  static isEmpty(cell: Cell | undefined): boolean {
    if (!cell) return true
    const value = cell.value
    return value === null || value === undefined || value === ''
  }

  /**
   * Check if cell contains numeric value
   */
  static isNumeric(cell: Cell | undefined): boolean {
    const displayValue = this.getDisplayValue(cell)
    return typeof displayValue === 'number'
  }

  /**
   * Check if cell contains boolean value
   */
  static isBoolean(cell: Cell | undefined): boolean {
    const displayValue = this.getDisplayValue(cell)
    return typeof displayValue === 'boolean'
  }

  /**
   * Check if cell contains date value
   */
  static isDate(cell: Cell | undefined): boolean {
    const displayValue = this.getDisplayValue(cell)
    return displayValue instanceof Date
  }

  /**
   * Get cell address (if available from cell metadata)
   */
  static getAddress(cell: Cell | undefined): string | undefined {
    if (!cell) return undefined
    // ExcelJS cells have address property when read from worksheet
    return (cell as any).address
  }

  /**
   * Format cell value as string for display
   */
  static formatAsString(cell: Cell | undefined): string {
    if (this.isEmpty(cell)) return ''
    
    const value = this.getDisplayValue(cell)
    
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toLocaleString('fr-FR')
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
    if (value instanceof Date) return value.toLocaleDateString('fr-FR')
    
    return String(value)
  }

  /**
   * Compare two cells for equality (by display value)
   */
  static equals(cell1: Cell | undefined, cell2: Cell | undefined): boolean {
    const val1 = this.getDisplayValue(cell1)
    const val2 = this.getDisplayValue(cell2)
    return val1 === val2
  }
}