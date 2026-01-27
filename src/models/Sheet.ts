import type { Worksheet } from 'exceljs'
import type { 
  SheetConfig,
  SheetMetadata,
  DataMatrix,
  Nullable,
} from '@/types'
import { Section } from './Section'

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

  get rawData(): ReadonlyArray<ReadonlyArray<unknown>> {
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