import type { Cell, CellValue, Worksheet } from 'exceljs'
import type { 
  SheetConfig,
  SheetMetadata,
  DataMatrix,
  Nullable,
} from '@/types'
import { Section } from './Section'
import { formulaEngine } from '@/services/FormulaEngine'
import { excelStore } from '@/stores/excelStore'

/**
 * Sheet Model
 * Encapsulates sheet data and operations
 */
export class Sheet {
  private constructor(private readonly config: SheetConfig) {}

  // ============================================================================
  // Factory methods
  // ============================================================================

  static create(
    name: string, 
    worksheet: Nullable<Worksheet>,
    rawData: DataMatrix,
    title: string,
    sections: Section[]
  ): Sheet {
    return new Sheet({
      name,
      worksheet,
      rawData,
      title,
      sections: sections.map(s => s.toConfig()),
      currentCell: null,
      editionMode: false,
    })
  }

  static fromConfig(config: SheetConfig): Sheet {
    return new Sheet({ ...config })
  }

  // ============================================================================
  // Getters
  // ============================================================================

  get name(): string {
    return this.config.name
  }

  get worksheet(): Nullable<Worksheet> {
    return this.config.worksheet
  }

  get rawData(): Readonly<DataMatrix> {
    return this.config.rawData
  }

  get title(): string {
    return this.config.title
  }

  get sections(): ReadonlyArray<Section> {
    return this.config.sections.map(s => Section.fromConfig(s))
  }

  // ============================================================================
  // Business logic
  // ============================================================================

  updateSection(sectionIndex: number, updater: (section: Section) => Section): Sheet {
    const sections = this.config.sections.map((s, i) => 
      i === sectionIndex ? updater(Section.fromConfig(s)).toConfig() : s
    )
    return new Sheet({ ...this.config, sections })
  }

  getSection(index: number): Section | undefined {
    const sectionConfig = this.config.sections[index]
    return sectionConfig ? Section.fromConfig(sectionConfig) : undefined
  }

  updateCell(cell: Cell, newValue: any): Sheet {
    const sheetName = this.name
    const value = cell.formula ? '=' + newValue : newValue
    const changes = formulaEngine.setCellValue(sheetName, Number(cell.row) -1 , Number(cell.col) -1, value)

    changes.forEach(change => {
      if (!('address' in change)) return // Skip named expressions
  
      const { row, col } = change.address

      const changedCell = this.rawData[row]?.[col] as Cell

      if (!changedCell) return 
      
      if (cell == changedCell && changedCell.formula) {
        changedCell.value = { formula: value.substring(1), result: change.newValue as any} // ExcelJS / HyperFormula type mismatch. Runtime safe – cast volontaire
      } else if (cell == changedCell) {
        changedCell.value = change.newValue as any
      } else {
        changedCell.value = { formula: changedCell.formula, result: change.newValue as any}
      }
    });

    return new Sheet({...this.config})
  }

  // ============================================================================
  // Query methods
  // ============================================================================

  getMetadata(): SheetMetadata {
    return {
      totalRows: this.config.rawData.length,
      totalColumns: this.config.rawData[0]?.length || 0,
      sectionCount: this.config.sections.length,
      hasTitle: !!this.config.title,
      isEmpty: this.config.rawData.length === 0,
    }
  }

  getSectionCount(): number {
    return this.config.sections.length
  }

  hasSections(): boolean {
    return this.config.sections.length > 0
  }

  isEmpty(): boolean {
    return this.config.rawData.length === 0
  }

  // ============================================================================
  // Serialization
  // ============================================================================

  toConfig(): SheetConfig {
    return { ...this.config }
  }

  toJSON(): SheetConfig {
    return this.toConfig()
  }
}