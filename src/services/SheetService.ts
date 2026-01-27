import type { Worksheet } from 'exceljs'
import { Sheet, Section } from '@/models'
import { ExcelParser } from './ExcelParser'
import { SectionDetector } from './SectionDetector'

/**
 * SheetService
 * Business logic for sheet operations
 */
export class SheetService {
  /**
   * Build a sheet from a worksheet
   */
  static buildSheet(name: string, worksheet: Worksheet): Sheet {
    const rawData = ExcelParser.extractRawData(worksheet)
    const title = String(rawData[0]?.[0] || '')
    const sectionConfigs = SectionDetector.detectSections(rawData)
    const sections = sectionConfigs.map(config => Section.fromConfig(config))

    return Sheet.create(name, worksheet, rawData, title, sections)
  }

  /**
   * Update a section in a sheet
   */
  static updateSection(
    sheet: Sheet,
    sectionIndex: number,
    updater: (section: Section) => Section
  ): Sheet {
    return sheet.updateSection(sectionIndex, updater)
  }

  /**
   * Get section by index
   */
  static getSection(sheet: Sheet, index: number): Section | undefined {
    return sheet.getSection(index)
  }
}