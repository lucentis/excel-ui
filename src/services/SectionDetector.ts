import type { SectionConfig, DataMatrix } from '@/types'
import { ExcelParser } from './ExcelParser'

/**
 * SectionDetector
 * Detects sections in raw Excel data
 */
export class SectionDetector {
  /**
   * Detect sections in raw data according to conventions:
   * - Row 1 = document title
   * - Sections separated by empty rows
   * - Section = optional title (1 cell) + header + data
   */
  static detectSections(rawData: DataMatrix): SectionConfig[] {
    const sections: SectionConfig[] = []
    let currentSectionRows: DataMatrix = []

    // Skip first row (document title)
    rawData.slice(1).forEach((row) => {
      if (!ExcelParser.isEmptyRow(row)) {
        // Non-empty row: add to current section
        currentSectionRows.push(row)
      } else {
        // Empty row: finalize current section
        if (currentSectionRows.length > 0) {
          sections.push(this.parseSection(currentSectionRows))
          currentSectionRows = []
        }
      }
    })

    // Finalize last section if not empty
    if (currentSectionRows.length > 0) {
      sections.push(this.parseSection(currentSectionRows))
    }

    return sections
  }

  /**
   * Parse a block of rows into a Section
   * Detects if first row is a title (1 cell) or directly a header
   */
  private static parseSection(rows: DataMatrix): SectionConfig {
    const section: SectionConfig = {
      header: [],
      data: [],
    }

    if (rows.length === 0) return section

    const firstRowCellCount = ExcelParser.countFilledCells(rows[0])

    if (firstRowCellCount === 1 && rows.length > 1) {
      // First row = section title (1 filled cell)
      section.title = rows[0]?.[0]
      section.header = rows[1]!
      section.data = rows.slice(2)
    } else {
      // No title, first row = header
      section.header = rows[0]!
      section.data = rows.slice(1)
    }

    return section
  }
}